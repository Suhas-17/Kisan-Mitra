import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { useTranslation } from "react-i18next";
import "./Weather.css";

var weatherConditions = require("../../translations/weather.json");

const weatherColor = {
  "clear-day": "#F5D6B3",
  "clear-night": "#F5D6B3",
  cloudy: "#A0BFF0",
  fog: "#F8F2F3",
  hail: "#D0E2ED",
  "partly-cloudy-day": "#A0BFF0",
  "partly-cloudy-night": "#A0BFF0",
  "rain-snow-showers-day": "#A0BFF0",
  "rain-snow-showers-night": "#A0BFF0",
  "rain-snow": "#A0BFF0",
  rain: "#A0BFF0",
  "showers-day": "#A0BFF0",
  "showers-night": "#A0BFF0",
  sleet: "#A0BFF0",
  "snow-showers-night": "#A0BFF0",
  snow: "#A0BFF0",
  "thunder-rain": "#A0BFF0",
  "thunder-showers-day": "#A0BFF0",
  "thunder-showers-night": "#A0BFF0",
  thunder: "#A0BFF0",
  wind: "#A0BFF0",
};

function Weather({ setWeatherClr }) {
  const { t } = useTranslation();
  var date = new Date();
  const { weather } = useAuth();
  var lang = localStorage.getItem("lang");
  useEffect(() => {
    if (weather) {
      setWeatherClr(weatherColor[weather.values[0].icon]);
    }
  }, [weather, setWeatherClr]);

  if (weather)
    return (
      <div
        className="weather"
        // style={
        //   weatherColor[weather.values[0].icon] && {
        //     filter: "invert(100%)",
        //   }
        // }
      >
        {weather.alerts && (
          <marquee
            className="alert__marquee"
            // style={
            //   weatherColor[weather.values[0].icon] && {
            //     filter: "invert(100%)",
            //   }
            // }
          >
            {weather.alerts.map((alt) => alt.headline + "                    ")}
          </marquee>
        )}
        <div className="current__weather">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/${weather.values[0].icon}.svg`}
            alt="error"
            className="weather__icon"
            // style={
            //   weatherColor[weather.currentConditions.icon] && {
            //     filter: "invert(100%)",
            //   }
            // }
          />
          {weather.currentConditions.temp ? (
            <h1>{weather.currentConditions.temp}&deg;C</h1>
          ):
          <h5>error getting <br /> current conditions</h5>
          }
          <div className="secondary_weather">
            {weather.currentConditions.humidity && (
              <p>
                {t("Humidity")}: {weather.currentConditions.humidity}%
              </p>
            )}
            {weather.currentConditions.wspd && (
              <p>
                {t("Wind")}: {weather.currentConditions.wspd}km/h
              </p>
            )}
          </div>
          <h4 className="weather__condition">
            {/* {days[today]},{" "} */}
            {date.toLocaleDateString(
              localStorage.getItem("lang") || undefined,
              {
                weekday: "long",
                day: "numeric",
                month: "short",
              }
            )}
            <br />
            {weather.values[0].conditions
              .split(", ")
              .map((type) => weatherConditions[type][lang === "kn" ? 1 : 0])
              .join(", ")}
          </h4>
        </div>

        <div className="weather__forecast">
          {weather.values.map((val, key) => {
            if (key !== 0) {
              date.setDate(date.getDate() + 1);
            }
            return (
              <div
                className="daily__forecast"
                data-tooltip={val.conditions
                  .split(", ")
                  .map((type) => weatherConditions[type][lang === "kn" ? 1 : 0])
                  .join(", ")}
                key={key}
              >
                {/* {days[(key + today) % 7].slice(0, 3)} */}
                <p className="maxt">
                  {date
                    .toLocaleDateString(
                      localStorage.getItem("lang") || undefined,
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      }
                    )
                    .split(",")[1]
                    .trim()}
                </p>
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/${val.icon}.svg`}
                  alt="error"
                  className="weather__icon"
                  // style={
                  //   weatherColor[weather.values[0].icon] && {
                  //     filter: "invert(100%)",
                  //   }
                  // }
                />
                <br />
                <span className="maxt">{Math.round(val.maxt)}&deg;</span>
                <span className="mint"> {Math.round(val.mint)}&deg;</span>
              </div>
            );
          })}
        </div>
      </div>
    );
}

export default Weather;
