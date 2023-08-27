import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../state/Reducers/eventsSlice";
import { usersState } from "../../state/Reducers/usersSlice";

import jwtDecode from "jwt-decode";
import { nanoid } from "nanoid";

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
    <section className="border rounded p-3">
      <h2>Events near you</h2>
      {events.map((event, index) => (
        <>
          <div key={index} className="mt-4">
            {event.name}
          </div>
          <img
            src={event.images[0].url}
            alt=""
            style={{ width: "100px", height: "60px", objectFit: "cover" }}
            key={nanoid()}
          />
          <div key={nanoid()}>
            <p key={nanoid()} className="m-0">
              {event.distance}Km from your location
            </p>
          </div>

          <a href={event.url} target="_blank" rel="noreferrer" key={nanoid()}>
            discover more...
          </a>
        </>
      ))}
    </section>
  );
};

export default Events;
