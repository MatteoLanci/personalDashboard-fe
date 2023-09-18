import React, { useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../state/Reducers/eventsSlice";

import { nanoid } from "nanoid";

import "./events.css";

const Events = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.events);

  const userLocation = useSelector((state) => state.userLocation.userLocation);
  // console.log(userLocation);
  const params = userLocation ? `${userLocation.latitude},${userLocation.longitude}` : "";
  // console.log(params);

  useEffect(() => {
    dispatch(fetchEvents(params));
  }, [dispatch, params]);

  return (
    <>
      <Carousel className="eventsMainWrapper">
        {events.map((event, index) => (
          <Carousel.Item className="eventsWrapper" key={nanoid()}>
            <img
              src={event.images[0].url}
              alt={event.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <Carousel.Caption>
              <h3>{event.name}</h3>
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
    </>
  );
};

export default Events;
