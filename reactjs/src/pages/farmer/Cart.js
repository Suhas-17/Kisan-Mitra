import React, { useState } from "react";
import Header from "../components/Header.js";
// import firebase from "firebase/compat/app";
import { useAuth } from "../../context/AuthContext.js";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import StripeContainer from "../StripeContainer";
import { useTranslation } from "react-i18next";
import "./Cart.css";

function Cart() {
  const { currentUser, cartItems, subTotal, userInfo } = useAuth();
  const [pay, setPay] = useState(false);
  const { t } = useTranslation();

  function changeQuantity(e, id, quantity) {
    e.preventDefault();
    db.collection("cart")
      .doc(currentUser.uid)
      .collection("items")
      .doc(id)
      .set({ quantity: parseInt(quantity) }, { merge: true })
      .then((e) => {
        toast.success(t("Product Quantity changed"));
        setTimeout(function () {
          document.location.reload(true);
        }, 3000);
      })
      .catch((e) => console.log(e));
  }

  function deleteItem(id) {
    // var obj = {};
    // obj[id] = firebase.firestore.FieldValue.delete();

    db.collection("cart")
      .doc(currentUser.uid)
      .collection("items")
      .doc(id)
      .delete()
      // .update(obj)
      .then((e) => {
        toast.success(t("Product removed from Cart"));
        setTimeout(function () {
          document.location.reload(true);
        }, 3000);
      });
  }

  return (
    <div className="cart">
      {pay ? (
        <p className="header__logo pay__logo">{t("Kisan Mitra")}</p>
      ) : (
        <Header />
      )}
      {!pay && cartItems && cartItems.length !== 0 && subTotal && (
        <div className="cart__container">
          <h4>
            {t("My Cart")}{" "}
            <span> &nbsp; {` ( ${subTotal[0]} ${t("items")} )`}</span>
          </h4>
          <div className="left__cart">
            {cartItems.map((i, key) => {
              return (
                <div key={key} className="cart__item">
                  <Link to={`/product/${i.id}`}>
                    <img className="cart__itemImg" src={i.image} alt="" />
                  </Link>
                  <div className="cart__desc">
                    <h4>{i.name}</h4>
                    <p>{i["company/manufacture"]}</p>
                    <select
                      value={i.quantity}
                      onChange={(e) => changeQuantity(e, i.id, e.target.value)}
                    >
                      {Array.from(Array(Math.min(i.stock, 10)), (n, i) => {
                        return (
                          <option value={i + 1} key={i}>
                            {i + 1}
                          </option>
                        );
                      })}
                    </select>
                    <strong>₹{parseFloat(i.price).toFixed(2)}</strong>
                    <button
                      className="cart__btn"
                      onClick={(e) => deleteItem(i.id)}
                    >
                      {t("Delete")}
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="sub__total">
              <p>
                {`${t("Subtotal")} (${subTotal[0]} ${t("items")}): `}
                <strong>{`₹${subTotal[1]}.00`}</strong>
              </p>
              <button className="cart__btn" onClick={(e) => setPay(true)}>
                {t("Proceed to Buy")}
              </button>
            </div>
          </div>
        </div>
      )}
      {cartItems && cartItems.length === 0 && (
        <div className="left__cart">
          <center style={{ padding: "20px" }}>
            {t("Your cart is empty.")}
          </center>
        </div>
      )}

      {pay && cartItems && cartItems.length !== 0 && subTotal && (
        <div className="payment__page">
          <div className="user__details">
            <h3>
              {t("Amount")}: ₹{parseFloat(subTotal[1]).toFixed(2)}
            </h3>
            <br />
            <h3>{t("Shipping Address")}</h3>
            {userInfo.address.length === 0 ? (
              <Link to="/account" className="invalid__address">
                {t("Your address is not valid. Click here to change")}
              </Link>
            ) : (
              <p className="user__address">
                <br />
                {userInfo.fullName}
                <br />
                {userInfo.address}
              </p>
            )}
          </div>
          <div className="payment__card">
            {userInfo.address.length !== 0 && <StripeContainer />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
