import React, { useEffect, useState, useRef, useContext } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

//! external libraries import
import jwtDecode from "jwt-decode";
import axios from "axios";
import { nanoid } from "nanoid";

//! components import
import Todo from "../../components/Todo/Todo";

//! context import
import { UsersContext } from "../../context/usersContext";

const Homepage = () => {
  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);
  // console.log(tokenDecoded);

  const { users } = useContext(UsersContext);
  console.log(users);

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

          <Col>
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  <a key={nanoid()} href={`/profile/${user._id}`}>
                    {user.firstName}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Homepage;
