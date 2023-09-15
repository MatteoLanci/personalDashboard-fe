import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import jwtDecode from "jwt-decode";

import Welcome from "../../components/WelcomeDate/WelcomeDate";
import Todo from "../../components/Todo/Todo";
import LatestNews from "../../components/LatestNews/LatestNews";
import WeatherApp from "../../components/WeatherApp/WeatherApp";
import Events from "../../components/Events/Events";
import Map from "../../components/Map/Map";
import Moneybox from "../../components/MoneyBox/Moneybox";
import Wishlist from "../../components/Wishlist/Wishlist";
import Community from "../../components/Community/Community";
import Pharmacies from "../../components/Pharmacies/Pharmacies";

import { useDispatch, useSelector } from "react-redux";
import { usersState } from "../../state/Reducers/usersSlice";
import { fetchUsers } from "../../state/Reducers/usersSlice";

import Lottie from "lottie-react";
import bgAnimation from "../../assets/bg/bg_light_hexa.json";
import "./Homepage.css";

const Homepage = () => {
  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);
  const dispatch = useDispatch();

  const users = useSelector(usersState);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (!users.length) {
    return <p>loading...</p>;
  }

  return (
    <>
      <div className="bgAnimation">
        <Lottie animationData={bgAnimation} />
      </div>

      <Container
        className="d-flex flex-column justify-content-center align-items-center mt-5"
        style={{ minHeight: "80vh" }}
      >
        <Row className="mt-5 g-3 d-flex justify-content-center align-items-start w-100">
          <Col
            xs={12}
            md={5}
            className="m-0 d-flex flex-column justify-content-center align-items-center gap-3 mb-3"
          >
            <Welcome />
            <WeatherApp />
          </Col>
          <Col xs={12} md={7} className="m-0">
            <Todo />
          </Col>
        </Row>

        <Row className="mt-4 w-100">
          <Col>
            <LatestNews />
          </Col>
        </Row>

        <Row className="mt-4 g-3 d-flex justify-content-center align-items-start w-100">
          <Col xs={12} md={5}>
            <Moneybox />
          </Col>
          <Col xs={12} md={7}>
            <Wishlist />
          </Col>
        </Row>

        <Row className="mt-4 d-flex justify-content-center align-items-center w-100">
          <Col xs={12} md={5}>
            <div className="border w-100 h-100 d-flex flex-column align-items-center justify-content-start">
              <h2>Events Near You</h2>
              <p>discover all the events and concerts near your position</p>
            </div>
          </Col>
          <Col xs={12} md={7}>
            <Events />
          </Col>
        </Row>

        <Row className="mt-4 w-100">
          <Col xs={12} md={5}>
            <Pharmacies />
          </Col>
          <Col xs={12} md={7}>
            <Map />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Community />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Homepage;
