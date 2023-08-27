import React, { useState } from "react";
import jwtDecode from "jwt-decode";

import { Container, Nav, Navbar, NavDropdown, Offcanvas, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

import { FiLogOut } from "react-icons/fi";

import { useSession } from "../../middlewares/ProtectedRoutes";

import "./Navbar.css";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../state/Reducers/themeSlice";

import { LuLightbulb } from "react-icons/lu";
import { LuLightbulbOff } from "react-icons/lu";

const NavigationBar = () => {
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const toggleThemeHandler = () => {
    dispatch(toggleTheme());
  };

  const [showMenu, setShowMenu] = useState(false);
  const session = useSession();

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = token ? jwtDecode(token) : null;

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

  return (
    <Navbar expand="lg" className="bg-dark" variant="dark">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand as={Link} to={`/homepage`}>
          Personal Dashboard
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
                className="text-light me-4"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                onClick={toggleThemeHandler}
              />
            ) : (
              <LuLightbulb
                className="text-light me-4"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                onClick={toggleThemeHandler}
              />
            )}

            <img
              src={tokenDecoded.avatar}
              alt={tokenDecoded.email}
              style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
              className="me-3"
              onClick={handleShowMenu}
            />

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
                  <img
                    src={tokenDecoded.avatar}
                    alt={tokenDecoded.firstName}
                    className="menuPropic"
                  />
                  <h4 className="mt-3">
                    {tokenDecoded.firstName} {tokenDecoded.lastName}
                  </h4>
                </div>

                <ListGroup>
                  <ListGroup.Item
                    className="menuItem bg-light"
                    as={Link}
                    to={`/profile/${tokenDecoded.id}`}
                    onClick={handleCloseMenu}
                  >
                    Profile
                  </ListGroup.Item>
                  <ListGroup.Item className="menuItem bg-light">Settings</ListGroup.Item>
                  <ListGroup.Item className="menuItem bg-light">Support</ListGroup.Item>
                  <ListGroup.Item className="menuItem bg-light">Community</ListGroup.Item>
                  <ListGroup.Item
                    className="menuItem mt-3 text-light bg-danger"
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
