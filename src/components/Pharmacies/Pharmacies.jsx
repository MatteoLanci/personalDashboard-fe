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
                  <h6 key={nanoid()} className="m-0">
                    {pharma.name}
                  </h6>

                  <div className="d-flex gap-5 mt-2">
                    <p style={{ fontSize: ".8rem" }} key={nanoid()}>
                      {pharma.address}
                    </p>

                    <h6 className="pharmaDistance" key={nanoid()}>
                      {pharma.distance}
                    </h6>
                  </div>

                  <div key={nanoid()} className=" pharmaTimeWrapper d-flex gap-3 mb-2 ">
                    <p className="m-0" key={nanoid()}>
                      {pharma.time}
                    </p>

                    {isPharmacyOpen(pharma) ? (
                      <Badge
                        key={nanoid()}
                        pill
                        bg="success"
                        className="d-flex align-items-center justify-content-center"
                      >
                        Now Open
                      </Badge>
                    ) : (
                      <Badge
                        key={nanoid()}
                        pill
                        bg="danger"
                        className="d-flex align-items-center justify-content-center"
                      >
                        Closed
                      </Badge>
                    )}
                  </div>

                  <div
                    key={nanoid()}
                    className={`d-flex gap-3 justify-content-start align-items-center mt-3 `}
                  >
                    <a
                      key={nanoid()}
                      href={`tel: ${pharma.phone}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <ImPhone key={nanoid()} className="pharmaPhoneIcon" />
                    </a>
                    <p className="m-0" key={nanoid()}>
                      {pharma.phone}
                    </p>
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
