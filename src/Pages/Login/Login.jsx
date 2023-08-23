import React, { useState } from "react";
import { Button, Container, Row, Col, Form, Spinner, FormGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [loginFormData, setLoginFormData] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const res = await axios.post(`${process.env.REACT_APP_SERVERBASE_URL}/login`, loginFormData);
      if (res.data.token) {
        localStorage.setItem("userLogged", JSON.stringify(res.data.token));
        setTimeout(() => {
          navigate("/homepage");
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error occurs during login: ", error);
    }
  };
  return (
    <>
      <Container
        style={{ minHeight: "80vh" }}
        className="d-flex flex-column align-items-center justify-content-center"
      >
        <h1>Login Page</h1>
        <Form onSubmit={handleLogin}>
          <FormGroup>
            <Form.Control
              name="email"
              type="email"
              placeholder="enter your Email"
              required
              onChange={(e) => setLoginFormData({ ...loginFormData, email: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Form.Control
              name="password"
              type="password"
              placeholder="enter your password"
              required
              onChange={(e) => setLoginFormData({ ...loginFormData, password: e.target.value })}
            />
          </FormGroup>
          <Button type="submit">Login Now</Button>
        </Form>

        <p>
          Not an user? <Link to={"/register"}>Register here</Link>
        </p>
      </Container>
    </>
  );
};

export default Login;
