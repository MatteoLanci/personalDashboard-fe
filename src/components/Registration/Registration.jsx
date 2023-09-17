import React, { useState } from "react";
import { Button, Container, Row, Col, Form, Spinner, FormGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { createUser } from "../../state/Reducers/usersSlice";
import "./registration.css";
import Lottie from "lottie-react";
import bgAnimation from "../../assets/bg/bg_light_hexa.json";

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formUser, setFormUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
  });

  const handleSubmitRegistration = (e) => {
    e.preventDefault();

    dispatch(createUser(formUser));
    navigate("/");
  };
  return (
    <>
      <div className="bgAnimation">
        <Lottie animationData={bgAnimation} />
      </div>

      <Container
        style={{ minHeight: "80vh" }}
        className="d-flex flex-column align-items-center justify-content-center"
      >
        <section className="registrationWrapper">
          <h1 className="mb-4">Registration</h1>
          <Form onSubmit={handleSubmitRegistration} className="formWrapper">
            <FormGroup className="registrationInput">
              <Form.Control
                className="registrationInputField"
                name="firstName"
                type="text"
                // placeholder="enter your firstName"
                onChange={(e) =>
                  setFormUser({
                    ...formUser,
                    firstName: e.target.value,
                  })
                }
                required
              />
              <p className="registrationPlaceholder">Your First Name</p>
            </FormGroup>

            <FormGroup className="registrationInput">
              <Form.Control
                className="registrationInputField"
                name="lastName"
                type="text"
                // placeholder="enter your lastName"
                onChange={(e) =>
                  setFormUser({
                    ...formUser,
                    lastName: e.target.value,
                  })
                }
                required
              />
              <p className="registrationPlaceholder">Your Last Name</p>
            </FormGroup>

            <FormGroup className="registrationInput">
              <Form.Control
                className="registrationInputField"
                name="dob"
                type="date"
                onChange={(e) =>
                  setFormUser({
                    ...formUser,
                    dob: e.target.value,
                  })
                }
                required
              />
            </FormGroup>

            <FormGroup className="registrationInput">
              <Form.Control
                className="registrationInputField"
                name="email"
                type="email"
                // placeholder="enter your Email"
                onChange={(e) =>
                  setFormUser({
                    ...formUser,
                    email: e.target.value,
                  })
                }
                required
              />
              <p className="registrationPlaceholder">Your Email</p>
            </FormGroup>

            <FormGroup className="registrationInput">
              <Form.Control
                className="registrationInputField"
                name="password"
                type="password"
                // placeholder="enter your password"
                onChange={(e) =>
                  setFormUser({
                    ...formUser,
                    password: e.target.value,
                  })
                }
                required
              />
              <p className="registrationPlaceholder">Choose a Password</p>
            </FormGroup>
            <Button type="submit" className="registrationBtn">
              Register Now
            </Button>
          </Form>

          <p className="m-0 mt-4">
            Already a member?{" "}
            <Link to={"/"} className="registerLoginLink">
              Login here
            </Link>
          </p>
        </section>
      </Container>
    </>
  );
};

export default Registration;
