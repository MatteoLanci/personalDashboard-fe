import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { pharmaciesState } from "../../state/Reducers/pharmaciesSlice";
import { handleGetPharmacies } from "../../state/Reducers/pharmaciesSlice";

import { nanoid } from "nanoid";
import "./pharmacies.css";

import { ImPhone } from "react-icons/im";

import Lottie from "lottie-react";
import loadingAnimation from "../../assets/generic/loading_animation.json";
import pharmaAnimation from "../../assets/pharmacies/pharma_animation.json";

const Pharmacies = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.pharmacies.loading);
  const userLocation = useSelector((state) => state.userLocation.userLocation);
  const theme = useSelector((state) => state.theme);

  const pharmacies = useSelector(pharmaciesState);
  const locationName = `${userLocation?.latitude},${userLocation?.longitude}`;

  useEffect(() => {
    dispatch(handleGetPharmacies(locationName));
  }, [dispatch, locationName]);

  return (
    <>
      <Container
        className={`${
          theme === "light" ? "pharmaciesElementWrapper" : "pharmaciesElementWrapperDark"
        }`}
      >
        <Row key={nanoid()} className="d-flex justify-content-between align-items-center">
          <Col xs={8}>
            <h2 className={`m-0 ${theme === "light" ? null : "text-light"}`} key={nanoid()}>
              Pharmacies
            </h2>
          </Col>

          <Col xs={4}>
            <Lottie key={nanoid()} animationData={pharmaAnimation} className="pharmaAnimation" />
          </Col>
        </Row>

        {loading ? (
          <>
            <Row key={nanoid()}>
              <Lottie
                key={nanoid()}
                animationData={loadingAnimation}
                className="pharmaLoadingAnimation"
              />
              <p key={nanoid()}>Retrieving Information...</p>
            </Row>
          </>
        ) : (
          <Row key={nanoid()} className="pharmaciesWrapper">
            {pharmacies.map((pharma) => {
              const pharmaClosed = pharma.info === "Chiuso";

              return (
                <>
                  <div
                    key={nanoid()}
                    className={`${theme === "light" ? "singlePharmaEl" : "singlePharmaElDark"}`}
                  >
                    <h6 key={nanoid()} className="m-0">
                      {pharma.name}
                    </h6>

                    <div key={nanoid()} className="d-flex gap-5 mt-2">
                      <p style={{ fontSize: ".8rem" }} key={nanoid()}>
                        {pharma.address}
                      </p>

                      <a
                        key={nanoid()}
                        href={`tel: ${pharma.phone}`}
                        rel="noreferrer"
                        target="_blank"
                        className={`pharmaCall ${pharmaClosed ? "d-none" : null}`}
                      >
                        <ImPhone key={nanoid()} className="pharmaPhoneIcon" />
                      </a>
                    </div>

                    <div
                      key={nanoid()}
                      className={`pharmaTimeWrapper d-flex gap-3 mb-2 
                      ${pharmaClosed ? "bg-danger text-light" : null}                
                      ${theme === "light" ? null : "text-dark"}`}
                    >
                      <p className="m-0" key={nanoid()}>
                        {pharma.info}
                      </p>
                    </div>
                  </div>
                </>
              );
            })}
          </Row>
        )}
      </Container>
    </>
  );
};

export default Pharmacies;
