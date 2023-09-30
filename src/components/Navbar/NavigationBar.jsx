import React, { useState, useRef } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";

import ModalDelAccount from "../Modals/ModalDelAccount";

import { Container, Row, Col, Navbar, Offcanvas, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { useSession } from "../../middlewares/ProtectedRoutes";

import "./Navbar.css";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../state/Reducers/themeSlice";
import { usersState } from "../../state/Reducers/usersSlice";
import { fetchUsers } from "../../state/Reducers/usersSlice";
import { handleUpdateUserInfo } from "../../state/Reducers/profileSlice";
import { weatherState } from "../../state/Reducers/weatherSlice";
import { handleDeleteAccount } from "../../state/Reducers/usersSlice";

import { LuLightbulb } from "react-icons/lu";
import { LuLightbulbOff } from "react-icons/lu";
import {
  FaUserShield,
  FaBirthdayCake,
  FaMapMarkedAlt,
  FaIdBadge,
  FaUserCircle,
} from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { BsFillGearFill } from "react-icons/bs";
import { PiUserSwitch } from "react-icons/pi";

import Lottie from "lottie-react";
import logoAnimation from "../../assets/navbar/logo_animation.json";
import logoutAnimation from "../../assets/navbar/logout_animation.json";
import supportAnimation from "../../assets/navbar/support_animation.json";

const NavigationBar = () => {
  const theme = useSelector((state) => state.theme);
  const users = useSelector(usersState);
  const weatherInfo = useSelector(weatherState);
  // const userLocation = useSelector((state) => state.userLocation.userLocation);

  const navigate = useNavigate();
  const session = useSession();
  const dispatch = useDispatch();

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = token ? jwtDecode(token) : null;
  const user = users.find((user) => user?._id === tokenDecoded?.id);
  const userId = user?._id;

  const [showMenu, setShowMenu] = useState(false);
  const [userEditMode, setUserEditMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(tokenDecoded?.avatar);
  // eslint-disable-next-line no-unused-vars
  const [file, setFile] = useState(null);
  const [dataToUpdate, setDataToUpdate] = useState({});
  const [showDelModal, setShowDelModal] = useState(false);

  const toggleThemeHandler = () => {
    dispatch(toggleTheme());
  };

  const handleLogOut = () => {
    localStorage.removeItem("userLogged");
    setShowMenu(false);
  };

  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  };
  const handleCloseMenu = () => {
    setShowMenu(false);

    setTimeout(() => {
      setUserEditMode(false);
    }, 1000);
  };

  const toggleEditMode = () => {
    setUserEditMode(!userEditMode);
  };

  const fileInputRef = useRef(null);

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
          await dispatch(fetchUsers(user._id));
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

  const handleEditUserInfo = async () => {
    await dispatch(handleUpdateUserInfo({ userId, dataToUpdate }))
      .then(() => dispatch(fetchUsers(userId)))
      .then(() => setUserEditMode(false))
      .catch((error) => {
        console.error("Error updating user info:", error);
      });
  };

  const handleDeleteUserAccount = () => {
    dispatch(handleDeleteAccount(userId));
    localStorage.removeItem("userLogged");
    setShowMenu(false);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleShowModal = () => {
    setShowDelModal(true);
  };

  return (
    <Navbar expand="lg" className={`${theme === "light" ? "navbarWrapper" : "navbarWrapperDark"}`}>
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand
          as={Link}
          to={`/homepage`}
          className={`${theme === "light" ? "logoWrapper" : "logoWrapperDark"}`}
        >
          DataDash
          <Lottie animationData={logoAnimation} className="logoAnimation" />
        </Navbar.Brand>

        {session && (
          <section className="userLoggedNavWrapper">
            {theme === "light" ? (
              <LuLightbulbOff
                className="me-4"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                onClick={toggleThemeHandler}
              />
            ) : (
              <LuLightbulb
                className="me-4"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                onClick={toggleThemeHandler}
              />
            )}

            {token ? (
              <img
                src={user?.avatar}
                alt={user?.email}
                className="me-3 navUserAvatar"
                onClick={handleShowMenu}
              />
            ) : null}

            <Offcanvas
              show={showMenu}
              onHide={handleCloseMenu}
              placement="end"
              className={`${theme === "light" ? "navbarMenu" : "navbarMenuDark"}`}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title />
              </Offcanvas.Header>

              <Offcanvas.Body className="userMenuBody">
                <div className="userMenuHeaderWrapper">
                  <img
                    src={user?.avatar || avatarUrl}
                    alt={user?.id}
                    className={`${theme === "light" ? "menuPropic" : "menuPropicDark"}`}
                  />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarUpdate}
                  />

                  <PiUserSwitch
                    className={`proPicIcon ${userEditMode ? "" : "d-none"}`}
                    onClick={handleBrowseImg}
                  />

                  <div className="mt-3 userDataElWrapper">
                    <FaUserShield className="userDataIcon" style={{ color: "#51889b" }} />
                    {userEditMode ? (
                      <Container className="p-0 m-0">
                        <Row className="g-2">
                          <Col xs={12} lg={6}>
                            <input
                              className="userEditInput"
                              type="text"
                              placeholder={`${user?.firstName}`}
                              onChange={(e) =>
                                setDataToUpdate({ ...dataToUpdate, firstName: e.target.value })
                              }
                            />
                          </Col>
                          <Col xs={12} lg={6}>
                            <input
                              className="userEditInput"
                              type="text"
                              placeholder={`${user?.lastName}`}
                              onChange={(e) =>
                                setDataToUpdate({ ...dataToUpdate, lastName: e.target.value })
                              }
                            />
                          </Col>
                        </Row>
                      </Container>
                    ) : (
                      <h4 className="userDataName" style={{ width: "100%" }}>
                        {user?.firstName} {user?.lastName}
                      </h4>
                    )}
                  </div>
                </div>

                <section className="userInfoWrapper">
                  <div className="userDataElWrapper">
                    <FaUserCircle className="userDataIcon" />
                    {userEditMode ? (
                      <input
                        className="userEditInput"
                        type="text"
                        placeholder={user?.userName}
                        onChange={(e) =>
                          setDataToUpdate({ ...dataToUpdate, userName: e.target.value })
                        }
                      />
                    ) : (
                      <p className="m-0">{user?.userName}</p>
                    )}
                  </div>

                  <div className="userDataElWrapper">
                    <IoIosMail className="userDataIcon" />
                    {userEditMode ? (
                      <input
                        className="userEditInput"
                        type="text"
                        placeholder={user?.email}
                        onChange={(e) =>
                          setDataToUpdate({ ...dataToUpdate, email: e.target.value })
                        }
                      />
                    ) : (
                      <p className="m-0">{user?.email}</p>
                    )}
                  </div>

                  <div className="userDataElWrapper">
                    <FaBirthdayCake className="userDataIcon" />
                    {userEditMode ? (
                      <input className="userEditInput" type="date" />
                    ) : (
                      <p className="m-0">{user?.dob}</p>
                    )}
                  </div>

                  <div className="userDataElWrapper">
                    <FaIdBadge className="userDataIcon" />
                    <p className="m-0 userMenuIdField">{user?._id}</p>
                  </div>

                  <div className="userDataElWrapper userDataLocation">
                    <FaMapMarkedAlt className="userDataIcon" />
                    <p className="m-0 me-2">Logged from: </p>
                    <p className="m-0">
                      {weatherInfo.name} ({weatherInfo?.sys?.country})
                    </p>
                  </div>

                  <div className={`userEditBtnsWrapper ${userEditMode ? "" : "d-none"}`}>
                    <Button className="userEditSaveBtn" onClick={handleEditUserInfo}>
                      Save Changes
                    </Button>
                    <Button className="userEditCancBtn" onClick={toggleEditMode}>
                      Cancel
                    </Button>
                  </div>
                  <div className={`userEditBtnsWrapper mt-4 ${userEditMode ? "" : "d-none"}`}>
                    <Button className="userDeleteAccountBtn" onClick={handleShowModal}>
                      Delete My Account
                    </Button>
                  </div>

                  <Button
                    onClick={toggleEditMode}
                    className={`manageAccountBtn mb-5  ${userEditMode ? "d-none" : ""}`}
                  >
                    <BsFillGearFill />
                    Manage Account
                  </Button>
                </section>

                <section className={`userMenuFooterWrapper ${userEditMode ? "d-none" : null}`}>
                  <div className="supportWrapper">
                    <div>
                      <h5 className="m-0 supportText">Need Help?</h5>
                    </div>

                    <Link
                      className="supportAnimationWrapper"
                      to={"/support"}
                      onClick={handleCloseMenu}
                    >
                      <Lottie animationData={supportAnimation} className="supportAnimation" />
                    </Link>
                  </div>

                  <div className="logoutBtnWrapper">
                    <Button
                      className="logoutBtn"
                      variant="danger"
                      onClick={handleLogOut}
                      as={Link}
                      to={"/"}
                    >
                      <Lottie animationData={logoutAnimation} className="logoutAnimation" />
                      Logout
                    </Button>
                  </div>
                </section>
              </Offcanvas.Body>
            </Offcanvas>
          </section>
        )}
      </Container>
      <ModalDelAccount
        show={showDelModal}
        onHide={() => setShowDelModal(false)}
        handleDeleteUserAccount={handleDeleteUserAccount}
      />
    </Navbar>
  );
};

export default NavigationBar;
