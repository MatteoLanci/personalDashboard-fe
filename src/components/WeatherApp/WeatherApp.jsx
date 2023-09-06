import React, { useEffect, useState } from "react";

import { Spinner } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { fetchWeather, weatherState } from "../../state/Reducers/weatherSlice";
import { usersState } from "../../state/Reducers/usersSlice";

import jwtDecode from "jwt-decode";

const WeatherApp = () => {
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

  return (
    <section className="border rounded p-3 bg-dark text-light">
      <h2>Weather App:</h2>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="grow" />
        </div>
      ) : weatherInfo ? (
        <>
          <h5>weather in {weatherInfo.name}</h5>
          {weatherInfo?.weather && weatherInfo.weather.length > 0 && (
            <div>local weather: {weatherInfo.weather[0].description}</div>
          )}

          <div>min temp: {tempMinCelsius.toFixed(1)} °C</div>
          <div>max temp: {tempMaxCelsius.toFixed(1)} °C</div>
          <div>humidity: {weatherInfo.main.humidity} %</div>
        </>
      ) : (
        <div>No weather data available.</div>
      )}
    </section>
  );
};

export default WeatherApp;
