import React, { useState, useContext, useEffect } from "react";
import { db, rdb, auth } from "../firebase";
import firebase from "firebase/compat/app";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [weather, setWeather] = useState();
  const [marketPrice, setMarketPrice] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [cartItems, setCartItems] = useState();
  const [subTotal, setSubTotal] = useState();
  const { t } = useTranslation();
  //signup
  function register(name, email, password, phoneNumber, profile, address) {
    var recaptcha = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
      size: "invisible",
    });
    // console.log(phoneNumber);
    auth
      .signInWithPhoneNumber(phoneNumber, recaptcha)
      .then(function (e) {
        var code = prompt("enter the code sent to your mobile number");

        if (code === null) return;

        e.confirm(code)
          .then(function (result) {
            toast.success(t("Phone verified"));
            result.user.updateProfile({
              id: result.user.uid,
              displayName: name,
            });

            if (email !== "") {
              var credential = firebase.auth.EmailAuthProvider.credential(
                email,
                password
              );
              auth.currentUser
                .linkWithCredential(credential)
                .then((usercred) => {
                  usercred.user.sendEmailVerification();
                  toast.info(t("Verification Mail sent"));
                })
                .catch((error) => {
                  toast.error(t("Account linking error"));
                });
            }

            const newUser = {
              profile: profile,
              fullName: name,
              email: email,
              phoneNumber: phoneNumber,
              address: address,
              favourites: [],
              createdAt: new Date(),
            };

            db.collection("users").doc(result.user.uid).set(newUser);
          })
          .catch(function (error) {
            toast.error(t("Could not verify, Please try again"));
          });
      })
      .catch(function (error) {
        toast.error(t("Please try again. We were unable to reach your phone."));
      });
  }

  //login
  async function loginEmailNPassword(email, password) {
    return await auth
      .signInWithEmailAndPassword(email, password)
      .then((e) => {
        if (e.user.emailVerified) {
          toast.success(t("Successfully Logged In"));
        } else {
          auth.signOut();
          toast.success(t("Verify your E-mail"));
        }
      })
      .catch(() => toast.error(t("Unable to Log-in")));
  }

  function loginPhoneNOtp(phoneNumber) {
    var recaptcha = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
      size: "invisible",
    });
    // console.log(phoneNumber);
    return auth
      .signInWithPhoneNumber(phoneNumber, recaptcha)
      .then(function (e) {
        var code = prompt(t("Enter the code sent to your mobile number"));

        if (code === null) return;

        e.confirm(code)
          .then(function (result) {
            toast.success(t("Phone Number verified"));
          })
          .catch(function (error) {
            toast.error(t("Could not verify, Please try again"));
            auth.signOut();
          });
      })
      .catch(function (error) {
        toast.error(t("Please try again. We were unable to reach your phone."));
        auth.signOut();
      });
  }

  //edit details

  function editUser(usr) {
    db.collection("users").doc(currentUser.uid).set(usr, { merge: true });
    localStorage.removeItem(currentUser.uid);
    document.location.reload(true);
  }

  //logout
  function logout() {
    auth.signOut();
    localStorage.clear();
    toast.warn(t("Logged Out"));
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (!user.phoneNumber) {
          return;
        }
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  async function tr(txt) {
    var res;
    for (let i = 0; i < txt.length; i++) {
      txt[i] = { from: "en", to: "kn", text: txt[i] };
    }

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Host": "translo.p.rapidapi.com",
        "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_TRANSLATION_API_KEY,
      },
      body: JSON.stringify(txt),
    };

    await fetch(
      "https://translo.p.rapidapi.com/api/v3/batch_translate/",
      options
    )
      .then((response) => response.json())
      .then((response) => (res = response))
      .catch((err) => console.error(err));
    return res.batch_translations.map((e) => e.text);
  }

  async function fetchTranslation(pre, set, obj) {
    if (obj === "cartItems") {
      let temp = await tr(
        pre.map((e) => e.name).concat(pre.map((e) => e["company/manufacture"]))
      );
      let l = temp.length / 2;
      await pre.forEach((e, key) => {
        e.name = temp[key];
        e["company/manufacture"] = temp[key + l];
      });
    } else if (obj === "product") {
      let res = await tr([
        pre.category,
        pre["company/manufacture"],
        pre.name,
        pre.descriptions,
      ]);

      pre.category = res[0];
      pre["company/manufacture"] = res[1];
      pre.name = res[2];
      pre.descriptions = res[3];
    } else if (obj === "weather") {
      let res = await tr([pre.headline]);
      pre.headline = res[0];
    }
    set(pre);
  }

  useEffect(() => {
    const getWeather = (lang) => {
      if (!navigator.geolocation) {
        toast.error(t("Geolocation is not supported by your browser"));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetch(
              `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?iconSet=icons1&locations=${position.coords.latitude},${position.coords.longitude}&aggregateHours=24&forecastDays=15&unitGroup=metric&shortColumnNames=false&contentType=json&lang=id&key=${process.env.REACT_APP_WEATHER_API_KEY}`
            )
              .then((res) => res.json())
              .then((data) => {
                let wther = data.locations[Object.keys(data.locations)[0]];
                if (wther.alerts !== null && lang !== "en") {
                  fetchTranslation(wther, setWeather, "weather");
                }
                setWeather(wther);
              });
          },
          () => {
            toast.error(t("Unable to retrieve your location"));
          }
        );
      }
    };

    const getCartItems = (lang) => {
      if (currentUser.uid) {
        db.collection("cart")
          .doc(currentUser.uid)
          .collection("items")
          .orderBy("time")
          .get()
          .then((e) => {
            if (e.size) {
              // let l = e.data();
              let list = [];
              // let qList = [];
              // for (let key in l) {
              //   list.push(key);
              //   qList.push(l[key]);
              // }

              e.forEach((item) => {
                list.push(item.data());
              });
              // setCartItems(list);

              // if (list.length) {
              //   db.collection("products")
              //     .where(firebase.firestore.FieldPath.documentId(), "in", list)
              //     .get()
              //     .then((res) => {
              //       let data = [];
              //       var i = 0;
              //       res.forEach((doc, key) => {
              //         let prod = doc.data();
              //         prod.id = doc.id;
              //         prod.quantity = qList[i];
              //         data.push(prod);
              //         i++;
              //       });
              lang === "en" || lang === null
                ? // true
                  setCartItems(list)
                : fetchTranslation(list, setCartItems, "cartItems");
              //     });
              // }
            } else setCartItems([]);

            // console.log(e);
          });
      }
    };

    const getMarketPricefromDb = () => {
      var d = new Date();
      return rdb
        .ref(d.toISOString().slice(0, 10))
        .once("value")
        .then((data) => {
          if (data.val() !== null) {
            setMarketPrice(data.val());
          } else {
            d.setDate(d.getDate() - 1);
            rdb
              .ref(d.toISOString().slice(0, 10))
              .once("value")
              .then((data) => setMarketPrice(data.val()));
          }
        });
    };

    if (currentUser) {
      let lang = localStorage.getItem("lang");
      let usr = localStorage.getItem(currentUser.uid);
      if (usr) {
        setUserInfo(JSON.parse(usr));
      } else {
        db.collection("users")
          .doc(currentUser.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              let user = doc.data();
              user.id = doc.id;
              user.object = "userInfo";
              localStorage.setItem(currentUser.uid, JSON.stringify(user));
              setUserInfo(user);
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      }
      getWeather(lang);
      getMarketPricefromDb();
      getCartItems(lang);
    } else {
      setUserInfo(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (cartItems) {
      var q = 0;
      var sub = 0;

      for (let index = 0; index < cartItems.length; index++) {
        q += cartItems[index].quantity;
        sub += cartItems[index].price * cartItems[index].quantity;
      }
      setSubTotal([q, sub]);
    }
  }, [cartItems]);

  function setFavourites(add, item) {
    db.collection("users")
      .doc(currentUser.uid)
      .set(
        {
          favourites: add
            ? firebase.firestore.FieldValue.arrayUnion(item)
            : firebase.firestore.FieldValue.arrayRemove(item),
        },
        { merge: true }
      )
      .then(() => {
        // toast(item + add ? " added to favourites" : " removed from favourites");
        localStorage.removeItem(currentUser.uid);
        document.location.reload(true);
      });
  }

  const value = {
    currentUser,
    userInfo,
    register,
    editUser,
    logout,
    loginEmailNPassword,
    loginPhoneNOtp,
    weather,
    cartItems,
    subTotal,
    marketPrice,
    setFavourites,
    fetchTranslation,
    loadingScreen,
    setLoadingScreen,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
