import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <h1>Login Page</h1>
      <Button as={Link} to={"/homepage"}>
        Login Now
      </Button>
    </>
  );
};

export default Login;
