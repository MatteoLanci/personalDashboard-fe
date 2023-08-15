import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

//! external libraries import
import jwtDecode from "jwt-decode";
import axios from "axios";

//! components import
import Todo from "../../components/Todo/Todo";

const Homepage = () => {
  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);
  // console.log(tokenDecoded);

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <h2 className="mb-5">Hello World, this is the Homepage</h2>
      <h4>User Logged:</h4>
      <img
        src={tokenDecoded.avatar}
        alt={tokenDecoded.email}
        style={{ height: "200px", width: "200px", borderRadius: "50%", objectFit: "cover" }}
      />
      <p>full name: {`${tokenDecoded.firstName} ${tokenDecoded.lastName}`}</p>
      <p>email: {tokenDecoded.email}</p>
      <p>date of birth: {tokenDecoded.dob}</p>
      <p>location: {tokenDecoded.location}</p>
      <p>ID: {tokenDecoded.id}</p>

      <Todo />
    </Container>
  );
};

export default Homepage;
