import React, { useEffect, useState, useCallback } from "react";

import { Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { fetchUsers } from "../../state/Reducers/usersSlice";

import Lottie from "lottie-react";
import notFoundAnimation from "../../assets/notFound/404_animation.json";
import notFoundRobotAnimation from "../../assets/notFound/robotOhNo_animation.json";

import "./NotFound.css";

const NotFound = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <>
      <section className="notFoundAnimationWrapper">
        <Lottie animationData={notFoundAnimation} className="notFoundAnimation" />
        <Lottie
          animationData={notFoundRobotAnimation}
          className="notFoundRobotAnimation"
          loop="1"
        />

        <div className="notFoundBtnWrapper">
          <Button as={Link} to={"/homepage"}>
            Back to Homepage
          </Button>
        </div>
      </section>
    </>
  );
};

export default NotFound;
