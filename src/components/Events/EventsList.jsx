import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../state/Reducers/eventsSlice";

import Lottie from "lottie-react";
import { nanoid } from "nanoid";

import eventsAnimation from "../../assets/events/events_animation.json";
import "./eventsList.css";
import { BsTicketFill } from "react-icons/bs";

const EventsList = () => {
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events.events);
  const userLocation = useSelector((state) => state.userLocation.userLocation);
  const theme = useSelector((state) => state.theme);

  const params = userLocation ? `${userLocation.latitude},${userLocation.longitude}` : "";

  const moreEventsLink = `https://www.ticketmaster.it`;

  useEffect(() => {
    dispatch(fetchEvents(params));
  }, [dispatch, params]);

  const milesToKilometers = (miles) => {
    return miles * 1.60934;
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  const formatTimeString = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`);
    const options = { hour: "numeric", minute: "numeric" };
    return time.toLocaleTimeString(undefined, options);
  };

  return (
    <Container className={`${theme === "light" ? "eventsListWrapper" : "eventsListWrapperDark"}`}>
      <div className="d-flex justify-content-start align-items-center gap-3">
        <h2 className={`mt-3 ${theme === "light" ? null : "text-light"}`}>Events near You</h2>
        <Lottie loop="1" animationData={eventsAnimation} className="eventsAnimation" />
      </div>
      <ul className="eventsList">
        {events.map((event) => (
          <div
            key={nanoid()}
            className={`${theme === "light" ? "eventListed" : "eventListedDark"}`}
          >
            <h5>{event.name}</h5>

            <div className={`eventDateTimeWrapper ${theme === "light" ? null : "text-dark"}`}>
              <p className="m-0">{formatDateString(event.dates.start.localDate)}</p>
              <em className="m-0">at</em>
              <p className="m-0">{formatTimeString(event.dates.start.localTime)}</p>
            </div>

            <h6 className="m-0">@ {event._embedded.venues[0].name}</h6>

            <div className="d-flex justify-content-start align-items-center gap-2">
              <article>{event._embedded.venues[0].city.name}</article>
              <em style={{ fontSize: ".8rem" }}>( {event._embedded.venues[0].country.name} )</em>
            </div>

            <div className="d-flex justify-content-start align-items-center gap-1 my-2">
              <h6 className="m-0">{milesToKilometers(event.distance).toFixed(2)} Km</h6>
              <p className="m-0" style={{ fontSize: ".8rem" }}>
                from your actual position
              </p>
            </div>

            <div className="buyTicketWrapper">
              <BsTicketFill className="ticketIcon" />
              <a target="_blank" rel="noreferrer" href={event.url} className="buyTicketLink">
                Get
                <br /> Ticket
              </a>
            </div>
          </div>
        ))}
        <a href={moreEventsLink} target="_blank" rel="noreferrer" className="moreEventsBtn">
          Show more events
        </a>
      </ul>
    </Container>
  );
};

export default EventsList;
