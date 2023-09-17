import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";

import { Container, Nav, Navbar, NavDropdown, Offcanvas, ListGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useSession } from "../../middlewares/ProtectedRoutes";

import "./Navbar.css";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../state/Reducers/themeSlice";
import { usersState } from "../../state/Reducers/usersSlice";

import { LuLightbulb } from "react-icons/lu";
import { LuLightbulbOff } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { FaUserShield, FaBirthdayCake, FaMapMarkedAlt, FaIdBadge } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { BsFillGearFill } from "react-icons/bs";

import Lottie from "lottie-react";
import logoAnimation from "../../assets/navbar/logo_animation.json";

const NavigationBar = () => {
  const theme = useSelector((state) => state.theme);
  const users = useSelector(usersState);
  const userLocation = useSelector((state) => state.userLocation.userLocation);

  const session = useSession();
  const dispatch = useDispatch();
  const toggleThemeHandler = () => {
    dispatch(toggleTheme());
  };

  const [showMenu, setShowMenu] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [userEditMode, setUserEditMode] = useState(false);

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = token ? jwtDecode(token) : null;
  const user = users.find((user) => user?._id === tokenDecoded?.id);

  const handleLogOut = () => {
    localStorage.removeItem("userLogged");
    setShowMenu(false);
  };

  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  };
  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const toggleEditMode = () => {
    setUserEditMode(!userEditMode);
  };

  useEffect(() => {
    if (user) {
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation?.latitude}&lon=${userLocation?.longitude}`;

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
  }, [userLocation, user]);

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

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={`/homepage`}>
              Home
            </Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>

        {session && (
          <>
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
                src={tokenDecoded.avatar}
                alt={tokenDecoded.email}
                className="me-3 navUserAvatar"
                onClick={handleShowMenu}
              />
            ) : null}

            <Link to={"/"}>
              <FiLogOut onClick={handleLogOut} />
            </Link>

            <Offcanvas
              show={showMenu}
              onHide={handleCloseMenu}
              placement="end"
              className="navbarMenu bg-light"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title />
              </Offcanvas.Header>

              <Offcanvas.Body>
                <div className="text-center mb-5">
                  <img src={tokenDecoded.avatar} alt={user?.id} className="menuPropic" />

                  <div className="mt-3 userDataElWrapper">
                    <FaUserShield className="userDataIcon" style={{ color: "#51889b" }} />
                    {userEditMode ? (
                      <input type="text" placeholder={`${user?.firstName} ${user?.lastName}`} />
                    ) : (
                      <h4 className="userDataName" style={{ width: "100%" }}>
                        {tokenDecoded.firstName} {tokenDecoded.lastName}
                      </h4>
                    )}
                  </div>
                </div>

                <section className="userInfoWrapper">
                  <div className="userDataElWrapper">
                    <IoIosMail className="userDataIcon" />
                    {userEditMode ? (
                      <input type="text" placeholder={user?.email} />
                    ) : (
                      <p className="m-0">{user?.email}</p>
                    )}
                  </div>

                  <div className="userDataElWrapper">
                    <FaBirthdayCake className="userDataIcon" />
                    <p className="m-0">{user?.dob}</p>
                  </div>

                  <div className="userDataElWrapper">
                    <FaIdBadge className="userDataIcon" />
                    <p className="m-0">{user?._id}</p>
                  </div>

                  <div className="userDataElWrapper">
                    <FaMapMarkedAlt className="userDataIcon" />
                    <p className="m-0 me-2">Currently logged from: </p>
                    <p className="m-0">{locationName}</p>
                  </div>

                  <Button
                    onClick={toggleEditMode}
                    className="d-flex justify-content-start align-items-center gap-2"
                  >
                    <BsFillGearFill />
                    Manage Account
                  </Button>
                </section>

                <ListGroup className="menuLinkWrapper">
                  <ListGroup.Item
                    className="menuItem"
                    as={Link}
                    to={`/profile/${tokenDecoded.id}`}
                    onClick={handleCloseMenu}
                  >
                    Profile
                  </ListGroup.Item>

                  <ListGroup.Item
                    className="menuItem"
                    as={Link}
                    to={"/support"}
                    onClick={handleCloseMenu}
                  >
                    Support
                  </ListGroup.Item>

                  <ListGroup.Item
                    className="menuItem logoutBtn mt-3 text-light bg-danger"
                    onClick={handleLogOut}
                    as={Link}
                    to={"/"}
                  >
                    Logout
                  </ListGroup.Item>
                </ListGroup>
              </Offcanvas.Body>
            </Offcanvas>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
