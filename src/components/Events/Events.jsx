import React, { useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../state/Reducers/eventsSlice";

import { nanoid } from "nanoid";

import "./events.css";

import Lottie from "lottie-react";
import loadingAnimation from "../../assets/generic/loading_animation.json";

const Events = () => {
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events.events);
  const userLocation = useSelector((state) => state.userLocation.userLocation);
  console.log(userLocation);

  const params = userLocation ? `${userLocation.latitude},${userLocation.longitude}` : "";

  useEffect(() => {
    dispatch(fetchEvents(params));
  }, [dispatch, params]);

  return (
    <>
      {userLocation === null ? (
        <div className="eventsMainWrapper">
          <Lottie animationData={loadingAnimation} />
        </div>
      ) : (
        <Carousel className="eventsMainWrapper">
          {events.map((event) => (
            <Carousel.Item className="eventsWrapper" key={nanoid()}>
              <img src={event.images[4].url} alt={event.name} className="eventImg" />

              <Carousel.Caption className="eventInfo">
                <h3 className="eventTitle m-0">{event.name}</h3>
                <div key={nanoid()}>
                  <p key={nanoid()} className="m-0">
                    {event.distance}Km from your location
                  </p>
                </div>

                <div key={nanoid()}>Day of event: {event.dates.start.localDate}</div>
                <div key={nanoid()}>Time of event: {event.dates.start.localTime}</div>

                <a href={event.url} target="_blank" rel="noreferrer" key={nanoid()}>
                  discover more...
                </a>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default Events;
