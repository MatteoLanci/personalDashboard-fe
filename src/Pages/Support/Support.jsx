import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Container, Row, Col } from "react-bootstrap";

import Lottie from "lottie-react";
import supportAnimation from "../../assets/support/support_animation.json";
import bgAnimation from "../../assets/bg/bg_light_hexa.json";

import { MdRocketLaunch, MdOutlineManageAccounts, MdBugReport } from "react-icons/md";

import "./support.css";

const Support = () => {
  const theme = useSelector((state) => state.theme);

  const [showHeaderText, setShowHeaderText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHeaderText(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={`${theme === "light" ? "bgAnimation" : "bgAnimationDark"}`}>
        <Lottie animationData={bgAnimation} />
      </div>

      <section
        className={`${
          theme === "light" ? "supportPageAnimationWrapper" : "supportPageAnimationWrapperDark"
        }`}
      >
        <Lottie animationData={supportAnimation} className="supportPageAnimation" loop="0" />
        {showHeaderText && (
          <h2 className={`supportHeaderText ${theme === "light" ? null : "text-light"}`}>
            How can we help?
          </h2>
        )}
      </section>

      <Container>
        <Row className="supportCardsWrapper">
          <Col xs={12} md={4}>
            <div className="supportCard">
              <div className="mb-3">
                <MdRocketLaunch className="supportCardLogo" />
              </div>
              <h6>Getting Started</h6>
              <p className="supportCardSubtext">
                Get your Help Scout account set up in just 6 simple steps.
              </p>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="supportCard">
              <div className="mb-3">
                <MdOutlineManageAccounts className="supportCardLogo" />
              </div>
              <h6>Account Management</h6>
              <p className="supportCardSubtext">
                Managing your account, creating new Users, pricing details, exporting data
              </p>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="supportCard">
              <div className="mb-3">
                <MdBugReport className="supportCardLogo" />
              </div>
              <h6>Reporting</h6>
              <p className="supportCardSubtext">
                Reporting features, metric definitions, use case scenarios
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Support;
