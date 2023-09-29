import React, { useEffect } from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { weatherState } from "../../state/Reducers/weatherSlice";
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

  const pharmacies = useSelector(pharmaciesState);
  // const locationName = weatherInfo.name;
  const locationName = `${userLocation?.latitude},${userLocation?.longitude}`;
  console.log(locationName);

  useEffect(() => {
    dispatch(handleGetPharmacies(locationName));
  }, [dispatch, locationName]);

  return (
    <>
      <Container className="pharmaciesElementWrapper">
        <Row key={nanoid()} className="d-flex justify-content-between align-items-center">
          <Col xs={8}>
            <h2 className="m-0" key={nanoid()}>
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
              const pharmaClosing = pharma.info.includes("Chiude tra");
              return (
                <>
                  <div key={nanoid()} className="singlePharmaEl">
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
                      className={`pharmaTimeWrapper d-flex gap-3 mb-2 ${
                        pharmaClosed ? "bg-danger text-light" : null
                      } ${pharmaClosing ? "bg-warning fw-bold" : null}`}
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
