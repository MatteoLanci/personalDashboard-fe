import React, { useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../state/Reducers/eventsSlice";
import { usersState } from "../../state/Reducers/usersSlice";

import jwtDecode from "jwt-decode";
import { nanoid } from "nanoid";

import "./events.css";

const Events = () => {
  const users = useSelector(usersState);
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.events);

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);

  const user = users.find((user) => user._id === tokenDecoded.id);
  const userCoordinates = user.location.replace(" ", "");

  useEffect(() => {
    dispatch(fetchEvents(userCoordinates));
  }, [dispatch]);

  return (
    <>
      <Carousel className="eventsMainWrapper">
        {events.map((event, index) => (
          <Carousel.Item className="eventsWrapper">
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
