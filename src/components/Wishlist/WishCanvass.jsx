import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button, Offcanvas, Form } from "react-bootstrap";

import { handleNewUserWish } from "../../state/Reducers/wishlistSlice";
import { getUserWishlist } from "../../state/Reducers/wishlistSlice";

import { usersState } from "../../state/Reducers/usersSlice";

import jwtDecode from "jwt-decode";

const WishCanvass = ({ showNewWish, setShowNewWish }) => {
  const dispatch = useDispatch();
  const users = useSelector(usersState);
  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);
  const user = users.find((user) => user._id === tokenDecoded.id);
  const userId = user._id;

  const handleCloseNewWish = () => setShowNewWish(false);

  const [formData, setFormData] = useState({
    content: "",
    price: null,
    url: "",
    description: "",
  });

  const handleAddWishEl = (e) => {
    e.preventDefault();

    dispatch(handleNewUserWish({ userId, formData })).then(() => {
      dispatch(getUserWishlist(userId));
    });

    setShowNewWish(false);
  };

  return (
    <>
      <Offcanvas show={showNewWish} onHide={handleCloseNewWish}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleAddWishEl}>
            <Form.Group className="mb-4">
              <Form.Label>content</Form.Label>
              <Form.Control
                type="text"
                placeholder="text"
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>price</Form.Label>
              <Form.Control
                type="number"
                placeholder="text"
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>url (optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="text"
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>description (optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="text"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></Form.Control>
            </Form.Group>

            <Button type="submit">Submit</Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default WishCanvass;
