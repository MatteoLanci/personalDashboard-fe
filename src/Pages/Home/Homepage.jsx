import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <>
      <h3>Hello World, this is the Homepage</h3>;
      <Button as={Link} to={"/"}>
        Logout
      </Button>
    </>
  );
};

export default Homepage;
