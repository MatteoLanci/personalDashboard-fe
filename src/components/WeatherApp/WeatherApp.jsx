import React, { useEffect, useState } from "react";

import { Spinner } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { fetchWeather, weatherState } from "../../state/Reducers/weatherSlice";
import { setUserLocation, setLoading, setError } from "../../state/Reducers/userLocationSlice";

import Lottie from "lottie-react";

import cloudsAnimationDay from "../../assets/weather/day/clouds_animation.json";
import lightRainAnimationDay from "../../assets/weather/day/light_rain_animation.json";
import clearSkyAnimationDay from "../../assets/weather/day/clear_sky_animation.json";
import fogAnimationDay from "../../assets/weather/day/fog_animation.json";
import snowAnimationDay from "../../assets/weather/day/snow_animation.json";
import thunderAnimationDay from "../../assets/weather/day/thunder_animation.json";
import cloudsAnimationNight from "../../assets/weather/night/clouds_night_animation.json";
import lightRainAnimationNight from "../../assets/weather/night/light_rain_night_animation.json";
import clearSkyAnimationNight from "../../assets/weather/night/clear_night_animation.json";
import fogAnimationNight from "../../assets/weather/night/fog_night_animation.json";
import snowAnimationNight from "../../assets/weather/night/snow_night_animation.json";
import thunderAnimationNight from "../../assets/weather/night/thunder_night_animation.json";

import { FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";

import "./weatherApp.css";

const WeatherApp = () => {
  const dispatch = useDispatch();
  const weatherInfo = useSelector(weatherState);
  const theme = useSelector((state) => state.theme);

  const userLocation = useSelector((state) => state.userLocation.userLocation);

  const [isLoading, setIsLoading] = useState(true);

  const tempMinKelvin = weatherInfo.main?.temp_min;
  const tempMinCelsius = tempMinKelvin - 273.15;

  const tempMaxKelvin = weatherInfo.main?.temp_max;
  const tempMaxCelsius = tempMaxKelvin - 273.15;

  useEffect(() => {
    dispatch(setLoading(true));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setUserLocation({ latitude, longitude }));
        dispatch(setLoading(false));
      });
    } else {
      dispatch(setError("Geolocation is not supported by this browser"));
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      if (userLocation) {
        const { latitude, longitude } = userLocation;
        dispatch(fetchWeather({ userLat: latitude, userLon: longitude }))
          .then(() => {
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            console.error(error);
          });
      }
    }, 3000);
  }, [dispatch, userLocation]);

  const now = new Date();
  const hours = now.getHours();

  return (
    <section className={`${theme === "light" ? "weatherMainWrapper" : "weatherMainWrapperDark"}`}>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="grow" />
        </div>
      ) : weatherInfo ? (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <div className="weatherDataWrapper">
              <h3>Weather in {weatherInfo.name}</h3>
              {weatherInfo?.weather && weatherInfo.weather.length > 0 && (
                <h6>{weatherInfo.weather[0].description}</h6>
              )}
              <div className={`${theme === "light" ? "tempWrapper" : "tempWrapperDark"}`}>
                <p className="singleTempWrapper">
                  <FaTemperatureLow className="tempLowIcon" /> {tempMinCelsius.toFixed(1)} °C
                </p>
                <p className="singleTempWrapper">
                  <FaTemperatureHigh className="tempHighIcon" /> {tempMaxCelsius.toFixed(1)} °C
                </p>
              </div>

              <div className="tempWrapper mt-1 ps-0">
                <p
                  className={`${theme === "light" ? "singleTempWrapper" : "singleTempWrapperDark"}`}
                >
                  <WiHumidity className="humidIcon" /> {weatherInfo.main.humidity}%
                </p>
              </div>
            </div>

            <div className="d-flex justify-content-start">
              {weatherInfo.weather[0].description.includes("clear") && hours <= 17 ? (
                <Lottie animationData={clearSkyAnimationDay} style={{ height: "200px" }} />
              ) : weatherInfo.weather[0].description.includes("clear") && hours >= 17 ? (
                <Lottie animationData={clearSkyAnimationNight} style={{ height: "200px" }} />
              ) : (weatherInfo.weather[0].description.includes("rain") ||
                  weatherInfo.weather[0].description.includes("light")) &&
                hours <= 17 ? (
                <Lottie animationData={lightRainAnimationDay} style={{ height: "200px" }} />
              ) : (weatherInfo.weather[0].description.includes("rain") ||
                  weatherInfo.weather[0].description.includes("light")) &&
                hours >= 17 ? (
                <Lottie animationData={lightRainAnimationNight} style={{ height: "200px" }} />
              ) : weatherInfo.weather[0].description.includes("clouds") && hours <= 17 ? (
                <Lottie animationData={cloudsAnimationDay} style={{ height: "200px" }} />
              ) : weatherInfo.weather[0].description.includes("clouds") && hours >= 17 ? (
                <Lottie animationData={cloudsAnimationNight} style={{ height: "200px" }} />
              ) : weatherInfo.weather[0].description.includes("heavy") && hours <= 17 ? (
                <Lottie animationData={thunderAnimationDay} style={{ height: "200px" }} />
              ) : weatherInfo.weather[0].description.includes("heavy") && hours >= 17 ? (
                <Lottie animationData={thunderAnimationNight} style={{ height: "200px" }} />
              ) : weatherInfo.weather[0].description.includes("snow") && hours <= 17 ? (
                <Lottie animationData={snowAnimationDay} style={{ height: "200px" }} />
              ) : weatherInfo.weather[0].description.includes("snow") && hours >= 17 ? (
                <Lottie animationData={snowAnimationNight} style={{ height: "200px" }} />
              ) : weatherInfo.weather[0].description.includes("fog") ||
                (weatherInfo.weather[0].description.includes("mist") && hours <= 17) ? (
                <Lottie animationData={fogAnimationDay} style={{ height: "200px" }} />
              ) : weatherInfo.weather[0].description.includes("fog") ||
                (weatherInfo.weather[0].description.includes("mist") && hours >= 17) ? (
                <Lottie animationData={fogAnimationNight} style={{ height: "200px" }} />
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <div>No weather data available.</div>
      )}
    </section>
  );
};

export default WeatherApp;
