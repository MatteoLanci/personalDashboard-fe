import React from "react";

import "leaflet/dist/leaflet.css";
import "./map.css";

import jwtDecode from "jwt-decode";

import { Container } from "react-bootstrap";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { usersState } from "../../state/Reducers/usersSlice";

import { useSelector } from "react-redux";

const Map = () => {
  const users = useSelector(usersState);
  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);
  const user = users.find((user) => user._id === tokenDecoded.id);

  let position = [0, 0];
  const [latitude, longitude] = user.location.split(",").map((coord) => parseFloat(coord.trim()));
  position = [latitude, longitude];

  return (
    <>
      <Container className="mapComponentWrapper w-100 p-0">
        <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="mapWrapper">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </Container>
    </>
  );
};

export default Map;
