import React, { useState } from "react";
import { Button, Container, Form, FormGroup, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../state/Reducers/usersSlice";
import Lottie from "lottie-react";
import bgAnimation from "../../assets/bg/bg_light_hexa.json";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [loginFormData, setLoginFormData] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await dispatch(loginUser(loginFormData));
      if (response.meta.requestStatus === "fulfilled") {
        setTimeout(() => {
          navigate("/homepage");
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error occurs during login: ", error);
    }
  };

  return (
    <>
      <div className="bgAnimation">
        <Lottie animationData={bgAnimation} />
      </div>

      <Container className="d-flex justify-content-center align-items-center">
        <section className="loginWrapper">
          <h1>Login</h1>
          <Form onSubmit={handleLogin} className="formWrapper">
            <FormGroup className="loginInput">
              <Form.Control
                className="loginInputField"
                name="email"
                type="email"
                // placeholder="Enter Your Email"
                required
                onChange={(e) => setLoginFormData({ ...loginFormData, email: e.target.value })}
              />
              <p className="loginPlaceholder">Enter Your Email</p>
            </FormGroup>

            <FormGroup className="loginInput">
              <Form.Control
                className="loginInputField"
                name="password"
                type="password"
                // placeholder="Enter Your Password"
                required
                onChange={(e) => setLoginFormData({ ...loginFormData, password: e.target.value })}
              />
              <p className="loginPlaceholder">Enter Your Password</p>
            </FormGroup>
            <Button type="submit" disabled={isLoading} className="loginBtn">
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" /> Logging In
                </>
              ) : (
                "Login Now"
              )}
            </Button>
          </Form>

          <p className="m-0">
            Aren't you a user?{" "}
            <Link to={"/register"} className="loginRegisterLink">
              Register here
            </Link>
          </p>
        </section>
      </Container>
    </>
  );
};

export default Login;
