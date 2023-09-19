import React, { useEffect } from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { weatherState } from "../../state/Reducers/weatherSlice";
import { pharmaciesState } from "../../state/Reducers/pharmaciesSlice";
import { handleGetPharmacies } from "../../state/Reducers/pharmaciesSlice";

import { nanoid } from "nanoid";
import "./pharmacies.css";

import Lottie from "lottie-react";
import loadingAnimation from "../../assets/generic/loading_animation.json";
import pharmaAnimation from "../../assets/pharmacies/pharma_animation.json";

const Pharmacies = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.pharmacies.loading);

  const date = new Date();
  const timeNowHours = date.getHours();
  const timeNowMin = date.getMinutes();
  const timeNow = `${timeNowHours}:${timeNowMin}`;

  const weatherInfo = useSelector(weatherState);
  const pharmacies = useSelector(pharmaciesState);
  const locationName = weatherInfo.name;

  const isPharmacyOpen = (pharmacy) => {
    const [openTime, closeTime] = pharmacy.time.split(" - ");
    return timeNow >= openTime && timeNow <= closeTime;
  };

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
            {pharmacies.map((pharma) => (
              <>
                <div key={nanoid()} className="singlePharmaEl">
                  <p key={nanoid()}>{pharma.name}</p>

                  <div className="d-flex gap-5">
                    <p style={{ fontSize: ".8rem" }} key={nanoid()}>
                      {pharma.address}
                    </p>

                    <p style={{ fontSize: ".8rem" }} key={nanoid()}>
                      {pharma.distance}
                    </p>
                  </div>

                  <div className="d-flex gap-3 mb-2">
                    <p className="m-0" key={nanoid()}>
                      {pharma.time}
                    </p>

                    {isPharmacyOpen(pharma) ? (
                      <Badge key={nanoid()} pill bg="success">
                        Now Open
                      </Badge>
                    ) : (
                      <Badge key={nanoid()} pill bg="danger">
                        Closed
                      </Badge>
                    )}
                  </div>

                  <div key={nanoid()} className={`d-flex gap-3 `}>
                    <p key={nanoid()}>{pharma.phone}</p>
                    <a
                      key={nanoid()}
                      href={`tel: ${pharma.phone}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default Pharmacies;
