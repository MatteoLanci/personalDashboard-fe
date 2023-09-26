import React from "react";

import "leaflet/dist/leaflet.css";
import "./map.css";

import { Container } from "react-bootstrap";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import mapMarkerIcon from "../../assets/map/map_marker.png";

import { useSelector } from "react-redux";

const Map = () => {
  const userLocation = useSelector((state) => state.userLocation.userLocation);
  const params = userLocation ? [userLocation.latitude, userLocation.longitude] : [0, 0];
  const icon = mapMarkerIcon;

  return (
    <>
      <Container className="mapComponentWrapper w-100 p-0">
        {JSON.stringify(params) !== JSON.stringify([0, 0]) ? (
          <MapContainer center={params} zoom={15} scrollWheelZoom={true} className="mapWrapper">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={params} icon={L.icon({ iconUrl: icon, iconSize: [30, 40] })}>
              <Popup>You are Here</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div>Couldn't retrieve your position</div>
        )}
      </Container>
    </>
  );
};

export default Map;
