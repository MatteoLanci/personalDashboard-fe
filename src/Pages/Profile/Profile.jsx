import React, { useRef, useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import axios from "axios";
import jwtDecode from "jwt-decode";

import { Container, Button } from "react-bootstrap";

import { PiUserSwitch } from "react-icons/pi";
import { GoGear } from "react-icons/go";

import "./Profile.css";

import { useDispatch, useSelector } from "react-redux";
import { usersState } from "../../state/Reducers/usersSlice";
import { fetchUsers } from "../../state/Reducers/usersSlice";
import { handleUpdateUserInfo } from "../../state/Reducers/profileSlice";
import { getCoordinatesFromCity } from "../../state/Reducers/profileSlice";

const Profile = () => {
  const params = useParams();
  const { id } = params;
  const dispatch = useDispatch();

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);
  const userLogged = tokenDecoded.id === id;

  const users = useSelector(usersState);
  const user = users.find((user) => user._id === id);

  const [isEditMode, setIsEditMode] = useState(false);
  const handleEditModeToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const [dataToUpdate, setDataToUpdate] = useState({});
  const handleEditUserInfo = () => {
    dispatch(handleUpdateUserInfo({ id, dataToUpdate }));
    setIsEditMode(false);
  };

  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const [latitude, longitude] = user.location.split(", ");

      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      axios
        .get(apiUrl)
        .then((response) => {
          const address =
            response.data.address.city ||
            response.data.address.town ||
            response.data.address.county;

          setLocationName(address);
        })
        .catch((error) => {
          console.error("Error while geocoding:", error);
        });
    }
  }, [user]);

  const handleCityChange = (e) => {
    const newCityName = e.target.value;
    setLocationName(newCityName);

    if (newCityName) {
      dispatch(getCoordinatesFromCity(newCityName)).then((action) => {
        if (getCoordinatesFromCity.fulfilled.match(action)) {
          const { latitude, longitude } = action.payload;

          const coordinatesString = `${latitude}, ${longitude}`;

          setDataToUpdate((prevData) => ({
            ...prevData,
            location: coordinatesString,
          }));

          console.log("coordinates obtained: ", coordinatesString);
        } else if (getCoordinatesFromCity.rejected.match(action)) {
          console.error("Error occurs while obtaining coordinates", action.error);
        }
      });
    }
  };

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
        console.error("File upload failed");
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
  //! end FUNCTION TO UPDATE PROPIC

  if (!user) {
    return <p>loading...</p>;
  }
  return (
    <>
      <Container
        className="d-flex flex-column justify-content-center align-items-center mb-5"
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
          {userLogged && <GoGear onClick={handleEditModeToggle} />}
        </h2>

        {isEditMode ? (
          <>
            <p className="d-flex align-items-center gap-1">
              Full Name:
              <input
                type="text"
                placeholder={user.firstName}
                onChange={(e) => setDataToUpdate({ ...dataToUpdate, firstName: e.target.value })}
              />
              <input
                type="text"
                placeholder={user.lastName}
                onChange={(e) => setDataToUpdate({ ...dataToUpdate, lastName: e.target.value })}
              />
            </p>

            <p className="d-flex align-items-center gap-1">
              Email:
              <input
                type="email"
                placeholder={user.email}
                onChange={(e) => setDataToUpdate({ ...dataToUpdate, email: e.target.value })}
              />
            </p>

            <p className="d-flex align-items-center gap-1">
              Date of Birth:
              <input
                type="date"
                placeholder={user.dob}
                onChange={(e) => setDataToUpdate({ ...dataToUpdate, dob: e.target.value })}
              />
            </p>

            <p className="d-flex align-items-center gap-1">
              Location:
              <input
                type="text"
                placeholder={locationName}
                onChange={(e) => {
                  setLocationName(e.target.value);
                  handleCityChange(e); // Chiamata separata per ottenere le coordinate
                }}
              />
            </p>

            <p className="d-flex align-items-center gap-1"></p>
          </>
        ) : (
          <>
            <p>full name: {`${user.firstName} ${user.lastName}`}</p>

            <p>email: {user.email}</p>

            <p>date of birth: {user.dob}</p>

            <p>
              location: {locationName} ({user.location})
            </p>

            <p>ID: {user._id}</p>
          </>
        )}
      </Container>

      {isEditMode && (
        <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
          <Button variant="outline-success" onClick={handleEditUserInfo}>
            Save Changes
          </Button>

          <Button variant="outline-danger" onClick={() => setIsEditMode(false)}>
            Cancel
          </Button>
        </div>
      )}
    </>
  );
};

export default Profile;
