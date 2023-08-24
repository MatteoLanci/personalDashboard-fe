import React, { useState } from "react";
import { Button, Container, Form, FormGroup, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../state/Reducers/usersSlice";

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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" /> Logging In
              </>
            ) : (
              "Login Now"
            )}
          </Button>
        </Form>

        <p>
          Not an user? <Link to={"/register"}>Register here</Link>
        </p>
      </Container>
    </>
  );
};

export default Login;
