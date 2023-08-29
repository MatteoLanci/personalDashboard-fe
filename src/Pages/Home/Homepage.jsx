import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import jwtDecode from "jwt-decode";
import { nanoid } from "nanoid";

import Todo from "../../components/Todo/Todo";
import LatestNews from "../../components/LatestNews/LatestNews";
import WeatherApp from "../../components/WeatherApp/WeatherApp";
import Events from "../../components/Events/Events";
import Map from "../../components/Map/Map";
import Moneybox from "../../components/MoneyBox/Moneybox";
import Wishlist from "../../components/Wishlist/Wishlist";

import { useDispatch, useSelector } from "react-redux";
import { usersState } from "../../state/Reducers/usersSlice";
import { fetchUsers } from "../../state/Reducers/usersSlice";

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
      <Container>
        <h2 className="mb-5">Welcome back {tokenDecoded.firstName}, here's your dashboard</h2>
      </Container>

      <Container
        className="d-flex flex-column justify-content-start align-items-start"
        style={{ minHeight: "80vh" }}
      >
        <Row className="w-100">
          <Col>
            <Todo />
          </Col>

          <Col key={nanoid()}>
            <ul key={nanoid()}>
              {users.map((user) => (
                <li key={nanoid()}>
                  <a key={nanoid()} href={`/profile/${user._id}`}>
                    {user.firstName}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <LatestNews />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <WeatherApp />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Events />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Map />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Wishlist />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Moneybox />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Homepage;
