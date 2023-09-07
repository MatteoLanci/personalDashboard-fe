import React, { useEffect, useState } from "react";

// import { nanoid } from "nanoid";
import jwtDecode from "jwt-decode";

import WishCanvass from "./WishCanvass";

import { Container, Button, Row, Collapse } from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";

import { wishlistState } from "../../state/Reducers/wishlistSlice";
import { usersState } from "../../state/Reducers/usersSlice";
import { moneyboxState } from "../../state/Reducers/moneyboxSlice";

import { getUserWishlist } from "../../state/Reducers/wishlistSlice";
import { handleDeleteWishEl } from "../../state/Reducers/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();

  const users = useSelector(usersState);
  const userMoneybox = useSelector(moneyboxState);
  const wishlists = useSelector(wishlistState);

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);
  const user = users.find((user) => user._id === tokenDecoded.id);

  const [loadingDelete, setLoadingDelete] = useState(false);

  const [showNewWish, setShowNewWish] = useState(false);
  const handleShowNewWish = () => setShowNewWish(true);

  const [expandedItems, setExpandedItems] = useState({});
  const handleExpand = (itemId) => {
    setExpandedItems((prevExpandedItems) => ({
      ...prevExpandedItems,
      [itemId]: !prevExpandedItems[itemId],
    }));
  };

  const userWishlist = [];
  if (user) {
    for (const wishlistItem of wishlists) {
      if (wishlistItem.user === user._id) {
        userWishlist.push(wishlistItem);
      }
    }
  }

  const [params, setParams] = useState({
    userId: user._id,
    wishlistItemId: "",
  });
  const handleDeleteWish = async () => {
    try {
      setLoadingDelete(true);

      await dispatch(handleDeleteWishEl(params));

      await dispatch(getUserWishlist(user._id));
    } catch (error) {
      console.error("Error removing element from wishlist:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    dispatch(getUserWishlist(user._id));
  }, [dispatch, user._id]);

  return (
    <Container className="p-4 border rounded" style={{ width: "400px" }}>
      <h2 className="mb-5">Wishlist</h2>

      {userWishlist.map((userWishEl) => {
        const itemPercentage = (userWishEl.price / userMoneybox.totalAmount) * 100;
        const itemDiff = userWishEl.price - userMoneybox.totalAmount;
        const wishItemStatus = userWishEl.completed === false ? "false" : "true";

        return (
          <Row key={userWishEl._id} className="mb-4">
            <Button
              onClick={() => handleExpand(userWishEl._id)}
              aria-controls={`collapse-wishEl-${userWishEl._id}`}
              aria-expanded={expandedItems[userWishEl._id]}
              variant="outline-primary"
            >
              <h5>{userWishEl.content}</h5>
              <p>{userWishEl.price.toFixed(2)} $(US)</p>
            </Button>

            <Collapse in={expandedItems[userWishEl._id]}>
              <div id={`collapse-wishEl-${userWishEl._id}`}>
                <p>{userWishEl.description}</p>

                <p className={`border rounded p-2`}>
                  {userWishEl.price > userMoneybox.totalAmount
                    ? ` You need to save ${itemDiff.toFixed(2)} $(US) to afford this item`
                    : `You should use the ${itemPercentage.toFixed(
                        2
                      )}% of your total Moneybox to afford
                  this item`}
                </p>
                <p>Completed: {wishItemStatus}</p>
                <div className="d-flex align-items-center gap-3">
                  <Button
                    variant="danger"
                    onClick={() => {
                      setParams({ ...params, wishlistItemId: userWishEl._id });
                      handleDeleteWish();
                    }}
                    disabled={loadingDelete}
                  >
                    {loadingDelete ? "Removing..." : "Delete"}
                  </Button>
                  <Button variant="outline-success">Buy with MoneyBox</Button>
                </div>
              </div>
            </Collapse>
          </Row>
        );
      })}
      <Row>
        <Button variant="outline-info" onClick={handleShowNewWish}>
          Make a wish
        </Button>

        <WishCanvass showNewWish={showNewWish} setShowNewWish={setShowNewWish} />
      </Row>
    </Container>
  );
};

export default Wishlist;
