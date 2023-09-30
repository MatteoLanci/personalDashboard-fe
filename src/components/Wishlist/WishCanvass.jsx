import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button, Offcanvas, Form } from "react-bootstrap";

import { handleNewUserWish } from "../../state/Reducers/wishlistSlice";
import { getUserWishlist } from "../../state/Reducers/wishlistSlice";

import { usersState } from "../../state/Reducers/usersSlice";

import jwtDecode from "jwt-decode";
import "./wishCanvass.css";

import Lottie from "lottie-react";
import wishElAnimation from "../../assets/wishlist/newWish_animation.json";

const WishCanvass = ({ showNewWish, setShowNewWish }) => {
  const dispatch = useDispatch();
  const users = useSelector(usersState);
  const theme = useSelector((state) => state.theme);
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
      <Offcanvas
        show={showNewWish}
        onHide={handleCloseNewWish}
        className={`${theme === "light" ? "offcanvasWrapper" : "offcanvasWrapperDark"}`}
      >
        <Offcanvas.Header closeButton className="offcanvasHeader"></Offcanvas.Header>

        <div className=" wishCanvasHeader mb-5">
          <h2 className={`wishCanvasText ${theme === "light" ? null : "text-light"}`}>
            Make a Wish
          </h2>
          <Lottie animationData={wishElAnimation} className={`newWishElAnimation`} loop="0" />
        </div>

        <Offcanvas.Body className="offcanvasBody">
          <Form onSubmit={handleAddWishEl}>
            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                placeholder="Item"
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Control
                type="number"
                placeholder="€"
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                placeholder="url (optional)"
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                placeholder="description (optional)"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" className="newWishElBtn">
              Add element
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default WishCanvass;
