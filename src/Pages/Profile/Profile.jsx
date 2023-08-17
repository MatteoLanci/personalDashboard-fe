import React, { useRef, useState, useEffect, useContext } from "react";

//! router-dom Import
import { useParams, Link } from "react-router-dom";

//! external libraries Import
import axios from "axios";
import jwtDecode from "jwt-decode";

//! react-bootstrap Import
import { Container, Row, Col, Button } from "react-bootstrap";

//! react-icons Import
import { PiUserSwitch } from "react-icons/pi";

//! css Import
import "./Profile.css";

//! context Import
import { UsersContext } from "../../context/usersContext";

const Profile = () => {
  const params = useParams();
  const { id } = params;
  const { users, setUsers } = useContext(UsersContext);

  const user = users.find((user) => user._id === id);

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);

  const userLogged = tokenDecoded.id === id;

  //! FUNCTION TO UPDATE PROPIC
  const [avatarUrl, setAvatarUrl] = useState(tokenDecoded.avatar);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

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
        <p>location: {user.location}</p>
        <p>ID: {user._id}</p>
      </Container>
    </>
  );
};

export default Profile;
