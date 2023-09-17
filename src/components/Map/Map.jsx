import React from "react";

import "leaflet/dist/leaflet.css";
import "./map.css";

import { Container } from "react-bootstrap";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { useSelector } from "react-redux";

const Map = () => {
  const userLocation = useSelector((state) => state.userLocation.userLocation);
  const params = userLocation ? [userLocation.latitude, userLocation.longitude] : [0, 0];

  return (
    <>
      <Container className="mapComponentWrapper w-100 p-0">
        {JSON.stringify(params) !== JSON.stringify([0, 0]) ? (
          <MapContainer center={params} zoom={15} scrollWheelZoom={false} className="mapWrapper">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={params}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div>oops</div>
        )}
      </Container>
    </>
  );
};

export default Map;
