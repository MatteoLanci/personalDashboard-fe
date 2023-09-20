import React from "react";
import { Container } from "react-bootstrap";

import Lottie from "lottie-react";
import supportAnimation from "../../assets/support/support_animation.json";

import "./support.css";

const Support = () => {
  return (
    <>
      <section className="supportPageAnimationWrapper">
        <Lottie animationData={supportAnimation} className="supportPageAnimation" />
      </section>

      <Container>
        <h2>Support Page</h2>
      </Container>
    </>
  );
};

export default Support;
