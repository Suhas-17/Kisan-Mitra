import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Weather from "../components/Weather";
// import { storage } from "../../firebase";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import "./FarmerHome.css";
import { useTranslation } from "react-i18next";

function Home() {
  const [products, setProducts] = useState();
  const [recommendation, setRecommendation] = useState();
  const [weatherClr, setWeatherClr] = useState();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  useEffect(() => {
    var lang = localStorage.getItem("lang");

    var prod = require(`./homepage-${lang || "en"}.json`);
    setProducts(prod);

    var pid = localStorage.getItem(`${currentUser.uid}/search`);

    if (pid !== null)
      fetch(
        `https://kisanmitra.pythonanywhere.com/search?id=${JSON.parse(
          pid
        ).toString()}&lang=${lang}&apikey=${
          process.env.REACT_APP_PYTHONANYWHERE_API_KEY
        }`
      )
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setRecommendation(data);
        });
  }, [currentUser]);
  // console.log("products>>>>>",products);
  const Item = ({ name, image, id }) => {
    return (
      <Link to={`/product/${id}`} className="item">
        <img src={image} alt="some thing went wrong" className="item__image" />
        <br />
        {name}
      </Link>
    );
  };

  const Category = ({ name, items }) => {
    return (
      <div className="category">
        <h4 className="category__name">{name}</h4>
        <div className="category__items">
          {items.map((item, key) => {
            return (
              <Item
                key={key}
                name={item.name}
                image={item.image}
                id={item.id}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="home">
      <Header />

      <div
        style={
          weatherClr && {
            background: `linear-gradient(to top, rgba(0,0,0,0) 65%, ${weatherClr})`,
          }
        }
      >
        <Weather setWeatherClr={setWeatherClr} />

        {products && (
          <div className="home__container">
            {recommendation && (
              <Category
                name={t("Recommended For You")}
                items={recommendation}
              />
            )}
            {Object.keys(products).map((key) => {
              return <Category key={key} name={key} items={products[key]} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
