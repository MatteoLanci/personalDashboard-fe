import React from "react";
import jwtDecode from "jwt-decode";

import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import { FiLogOut } from "react-icons/fi";

//! middlewares Import
import { useSession } from "../../middlewares/ProtectedRoutes";

const NavigationBar = () => {
  const session = useSession();

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = token ? jwtDecode(token) : null;

  const handleLogOut = () => {
    localStorage.removeItem("userLogged");
  };

  return (
    <Navbar expand="lg" className="bg-dark" variant="dark">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
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
            <img
              src={tokenDecoded.avatar}
              alt={tokenDecoded.email}
              style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
              className="me-3"
            />

            <Link to={"/"}>
              <FiLogOut onClick={handleLogOut} />
            </Link>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
