import React, { useEffect, useState } from "react";

import { Spinner } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { fetchWeather, weatherState } from "../../state/Reducers/weatherSlice";
import { usersState } from "../../state/Reducers/usersSlice";

import jwtDecode from "jwt-decode";
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

import "./weatherApp.css";

const WeatherApp = () => {
  //!
  const [userLocation, setUserLocation] = useState(null);
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  useEffect(() => {
    getUserLocation();
  }, []);
  useEffect(() => {
    console.log(userLocation); // Esegui il console.log solo quando userLocation cambia
  }, [userLocation]);
  //!
  const users = useSelector(usersState);
  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);

  const user = users.find((user) => user._id === tokenDecoded.id);

  const userCoordinates = user.location.split(",");

  const userLat = userCoordinates[0].split(" ");
  const userLon = userCoordinates[1].trim();

  const dispatch = useDispatch();
  const weatherInfo = useSelector(weatherState);

  const [isLoading, setIsLoading] = useState(true);

  const tempMinKelvin = weatherInfo.main?.temp_min;
  const tempMinCelsius = tempMinKelvin - 273.15;

  const tempMaxKelvin = weatherInfo.main?.temp_max;
  const tempMaxCelsius = tempMaxKelvin - 273.15;

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      dispatch(fetchWeather({ userLat, userLon }))
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error(error);
        });
    }, 3000);
  }, [dispatch, user, users]);

  const now = new Date();
  const hours = now.getHours();

  return (
    <section className="weatherMainWrapper">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="grow" />
        </div>
      ) : weatherInfo ? (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3>weather in {weatherInfo.name}</h3>
              {weatherInfo?.weather && weatherInfo.weather.length > 0 && (
                <div>local weather: {weatherInfo.weather[0].description}</div>
              )}

              <p className="m-0">min temp: {tempMinCelsius.toFixed(1)} °C</p>
              <p className="m-0">max temp: {tempMaxCelsius.toFixed(1)} °C</p>
              <p className="m-0">humidity: {weatherInfo.main.humidity} %</p>
            </div>

            <div className="d-flex justify-content-start">
              {weatherInfo.weather[0].description.includes("clear") && hours <= 17 ? (
                <Lottie animationData={clearSkyAnimationDay} style={{ height: "200px" }} />
              ) : weatherInfo.weather[0].description.includes("clear") && hours >= 17 ? (
                <Lottie animationData={clearSkyAnimationNight} style={{ height: "200px" }} />
              ) : weatherInfo.weather[0].description.includes("rain") && hours <= 17 ? (
                <Lottie animationData={lightRainAnimationDay} style={{ height: "200px" }} />
              ) : weatherInfo.weather[0].description.includes("rain") && hours >= 17 ? (
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
              ) : weatherInfo.weather[0].description.includes("fog") && hours <= 17 ? (
                <Lottie animationData={fogAnimationDay} style={{ height: "200px" }} />
              ) : weatherInfo.weather[0].description.includes("fog") && hours >= 17 ? (
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
