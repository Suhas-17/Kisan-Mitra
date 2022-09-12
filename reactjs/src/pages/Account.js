import React, { useState, useEffect } from "react";
import Header from "./components/Header.js";
import { useAuth } from "../context/AuthContext.js";
import { db } from "../firebase";
import { BiLogOut } from "react-icons/bi";
import { RiPencilFill } from "react-icons/ri";
import { BsCheckLg, BsXLg } from "react-icons/bs";
// import { BiDotsVerticalRounded } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TextareaAutosize from "react-textarea-autosize";

// import { db } from "../firebase";
import "./Account.css";

function Account() {
  const { userInfo, logout, editUser } = useAuth();
  const [edit, setEdit] = useState(false);
  const [orders, setOrders] = useState();

  const { t } = useTranslation();
  // useEffect(() => {
  //   if (currentUser) {
  //     db.collection("users")
  //       .doc(currentUser.uid)
  //       .get()
  //       .then((doc) => {
  //         // console.log("Document data:");
  //         let user = doc.data();
  //         user.uid = doc.uid;
  //         setUserInfo(user);
  //       })
  //       .catch((error) => {
  //         console.log("Error getting document:", error);
  //       });
  //   }
  // }, []);

  useEffect(() => {
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
          pre
            .map((e) => e.name)
            .concat(pre.map((e) => e["company/manufacture"]))
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
      } else if (obj === "orders") {
        let temp = await tr(
          pre
            .map((e) => e.name)
            .concat(pre.map((e) => e["company/manufacture"]))
        );
        let l = temp.length / 2;
        await pre.forEach((e, key) => {
          e.name = temp[key];
          e["company/manufacture"] = temp[key + l];
        });
      }
      set(pre);
    }

    if (userInfo) {
      db.collection("orders")
        .where("userId", "==", userInfo.id)
        .orderBy("time", "desc")
        .get()
        .then((e) => {
          let data = [];
          e.forEach((items) => {
            data.push(items.data());
          });
          // setOrders(data);
          // console.log(fetchTranslation());
          if (data.length) {
            let lang = localStorage.getItem("lang");
            lang === "en" || lang === null
              ? // true
                setOrders(data)
              : fetchTranslation(data, setOrders, "orders");
          } else setOrders([]);

          // db.collection("products")
          //   .where(firebase.firestore.FieldPath.documentId(), "in", list)
          //   .get()
          //   .then((res) => {
          //     let data = [];
          //     var i = 0;
          //     res.forEach((doc, key) => {
          //       let prod = doc.data();
          //       prod.id = doc.id;
          //       prod.quantity = qList[i];
          //       data.push(prod);
          //       i++;
          //     });

          //   });
        });
    }
  }, [userInfo]);

  const onLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="account">
      <Header />

      <div className="account__container">
        <h3>
          <b>{t("Account Info")}</b>
        </h3>
        <br />
        {userInfo && (
          <div className="info">
            <b>{t("Name")}:&ensp; </b> {userInfo.fullName} <br />
            <b>{t("E-Mail")}:&ensp; </b> {userInfo.email} <br />
            <b>{t("Phone Number")}:&ensp; </b> {userInfo.phoneNumber} <br />
            <b>{t("Address")}:&ensp; </b>
            {/* <input
              type="text"
              id="address"
              placeholder={userInfo.address}
              disabled={!edit}
            /> */}
            <TextareaAutosize
              minRows={0}
              maxRows={5}
              type="text"
              id="address"
              placeholder={userInfo.address}
              disabled={!edit}
            />
            {edit ? (
              <>
                <BsCheckLg
                  className="cursor__pointer"
                  onClick={(e) => {
                    document.getElementById("address").value.length &&
                      editUser({
                        address: document.getElementById("address").value,
                      });
                    setEdit(false);
                  }}
                />
                <BsXLg
                  className="cursor__pointer"
                  onClick={(e) => {
                    document.getElementById("address").value = "";
                    setEdit(false);
                  }}
                />
              </>
            ) : (
              <RiPencilFill
                className="cursor__pointer"
                onClick={(e) => setEdit(true)}
              />
            )}
            <br />
            <div className="btn__div">
              <div>
                {/* <b>{t("Language")}:&ensp; </b>
                <select
                  className="lang__selector"
                  value={localStorage.getItem("lang") || "en"}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option value="en">{t("English")}</option>
                  <option value="kn">{t("Kannada")}</option>
                </select> */}
              </div>
              <button className="logout_btn" onClick={(e) => onLogout(e)}>
                <BiLogOut /> &nbsp;
                <span>{t("logout")}</span>
              </button>
            </div>
          </div>
        )}
        <br />
        <h3>
          <b>{t("Orders")}</b>
        </h3>
        <br />
        {orders && (
          <div className="info">
            {orders.length === 0 ? (
              <center> {t("You have not placed any orders.")}</center>
            ) : (
              orders.map((i, key) => {
                return (
                  <div key={key} className="cart__item">
                    <Link to={`/product/${i.id}`}>
                      <img className="cart__itemImg" src={i.image} alt="" />
                    </Link>
                    <div className="cart__desc">
                      <h4>{i.name}</h4>
                      <p>{i["company/manufacture"]}</p>
                      <p>Qty: {i["quantity"]}</p>
                      <strong>₹{parseFloat(i.price).toFixed(2)}</strong>
                      <p>
                        {new Date(i.time.seconds * 1000).toLocaleDateString(
                          localStorage.getItem("lang") || undefined,
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                      <a className="invoice__btn" href={i.url}>
                        {t("Get Invoice")}
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
