import React, { useEffect, useState, useRef } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

//! external libraries import
import jwtDecode from "jwt-decode";
import axios from "axios";

//! components import
import Todo from "../../components/Todo/Todo";

const Homepage = () => {
  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);
  // console.log(tokenDecoded);

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

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <h2 className="mb-5">Hello World, this is the Homepage</h2>
      <h4>User Logged:</h4>
      <section>
        <img
          // src={tokenDecoded.avatar}
          src={avatarUrl}
          alt={tokenDecoded.email}
          style={{
            height: "200px",
            width: "200px",
            borderRadius: "50%",
            objectFit: "cover",
            boxShadow: "0 0 5px #00000060",
          }}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarUpdate}
        />
      </section>

      <Button className="my-2" size="sm" variant="outline-secondary" onClick={handleBrowseImg}>
        Browse...
      </Button>

      <p>full name: {`${tokenDecoded.firstName} ${tokenDecoded.lastName}`}</p>
      <p>email: {tokenDecoded.email}</p>
      <p>date of birth: {tokenDecoded.dob}</p>
      <p>location: {tokenDecoded.location}</p>
      <p>ID: {tokenDecoded.id}</p>

      <Todo />
    </Container>
  );
};

export default Homepage;
