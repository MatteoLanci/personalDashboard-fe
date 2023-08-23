import React, { useRef, useState, useEffect } from "react";

//! router-dom Import
import { useParams } from "react-router-dom";

//! external libraries Import
import axios from "axios";
import jwtDecode from "jwt-decode";

//! react-bootstrap Import
import { Container } from "react-bootstrap";

//! react-icons Import
import { PiUserSwitch } from "react-icons/pi";

//! css Import
import "./Profile.css";

import { useDispatch, useSelector } from "react-redux";
import { usersState } from "../../state/Reducers/usersSlice";
import { fetchUsers } from "../../state/Reducers/usersSlice";

const Profile = () => {
  const params = useParams();
  const { id } = params;
  const dispatch = useDispatch();

  const users = useSelector(usersState);

  const user = users.find((user) => user._id === id);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);

  const userLogged = tokenDecoded.id === id;

  const [locationName, setLocationName] = useState("");
  useEffect(() => {
    if (user) {
      const [latitude, longitude] = user.location.split(", ");

      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      axios
        .get(apiUrl)
        .then((response) => {
          const address = response.data.address.town || response.data.address.city;
          setLocationName(address);
        })
        .catch((error) => {
          console.error("Error while geocoding:", error);
        });
    }
  }, [user]);

  //! FUNCTION TO UPDATE PROPIC
  const [avatarUrl, setAvatarUrl] = useState(tokenDecoded.avatar);
  const fileInputRef = useRef(null);
  const [setFile] = useState(null);

  const handleBrowseImg = () => {
    fileInputRef.current.click();
  };

  const handleAvatarUpdate = async (e) => {
    setFile(e.target.files[0]);

    if (e.target.files.length > 0) {
      const uploadedFile = await uploadFile(e.target.files[0]);

      if (uploadedFile) {
        try {
          const res = await axios.patch(
            `${process.env.REACT_APP_SERVERBASE_URL}/users/${tokenDecoded.id}`,
            { avatar: uploadedFile.avatar },
            { headers: { "Content-Type": "application/json" } }
          );
          setAvatarUrl(uploadedFile.avatar);
          return res.data;
        } catch (error) {
          console.log("Error occurs updating author: ", error);
        }
      } else {
        console.error("File upoload failed");
      }
    }
  };

  const uploadFile = async (file) => {
    const avatarData = new FormData();
    avatarData.append("avatar", file);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/cloudinaryUpload`,
        avatarData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data;
    } catch (error) {
      console.log("Avatar upload error occurs: ", error);
    }
  };
  //! END FUNCTION TO UPDATE PROPIC

  if (!user) {
    return <p>loading...</p>;
  }
  return (
    <>
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "80vh", position: "relative" }}
      >
        <section className="profileHeader ">
          <img
            src={tokenDecoded.profileCover}
            alt={`${tokenDecoded.firstName}'s profileCover`}
            style={{ objectFit: "cover" }}
          />
        </section>

        <section className="profileImgWrapper">
          <img
            src={user.avatar || avatarUrl}
            alt={user._id}
            style={{
              height: "200px",
              width: "200px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "5px solid #ffffff",
              boxShadow: "0 5px 10px #00000070",
            }}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarUpdate}
          />
          {userLogged && <PiUserSwitch className="editPropicIcon" onClick={handleBrowseImg} />}
        </section>

        <h2>
          {user.firstName} {user.lastName}
        </h2>

        <p>full name: {`${user.firstName} ${user.lastName}`}</p>
        <p>email: {user.email}</p>
        <p>date of birth: {user.dob}</p>
        <p>
          location: {locationName} ({user.location})
        </p>
        <p>ID: {user._id}</p>
      </Container>
    </>
  );
};

export default Profile;
