import React, { useEffect, useState } from "react";

// import { nanoid } from "nanoid";
import jwtDecode from "jwt-decode";

import WishCanvass from "./WishCanvass";

import { Container, Button, Row, Collapse } from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";

import { wishlistState } from "../../state/Reducers/wishlistSlice";
import { usersState } from "../../state/Reducers/usersSlice";
import { moneyboxState, getMoneybox } from "../../state/Reducers/moneyboxSlice";
import { getUserTransactions } from "../../state/Reducers/transactionsSlice";

import { getUserWishlist } from "../../state/Reducers/wishlistSlice";
import { handleDeleteWishEl } from "../../state/Reducers/wishlistSlice";
import { handlePurchase } from "../../state/Reducers/transactionsSlice";

import Lottie from "lottie-react";
import wishlistAnimation from "../../assets/wishlist/wishlist_animation.json";
import wishCompleteAnimation from "../../assets/wishlist/itemPurchased_animation.json";

import "./wishlist.css";

const Wishlist = () => {
  const dispatch = useDispatch();

  const users = useSelector(usersState);
  const userMoneybox = useSelector(moneyboxState);
  const wishlists = useSelector(wishlistState);
  const theme = useSelector((state) => state.theme);

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

  const [purchaseParams, setPurchaseParams] = useState({
    userId: user._id,
    productId: "",
    moneyboxId: "",
  });

  const handleMoneyboxBuy = async () => {
    try {
      await dispatch(handlePurchase(purchaseParams));
      await dispatch(getUserTransactions(purchaseParams));
      await dispatch(getUserWishlist(user._id));
      await dispatch(getMoneybox(user._id));
    } catch (error) {
      console.error("Error completing purchase through moneybox: ", error);
    }
  };

  useEffect(() => {
    dispatch(getUserWishlist(user._id));
  }, [dispatch, user._id]);

  return (
    <Container
      className={`${theme === "light" ? "wishlistWrapper" : "wishlistWrapperDark text-light"}`}
    >
      <Lottie animationData={wishlistAnimation} className="wishAnimation" />
      <h2 className="mb-3">Wishlist</h2>
      <Row className="w-100 wishesWrapper mx-auto">
        {userWishlist.map((userWishEl) => {
          const itemPercentage = (userWishEl.price / userMoneybox.totalAmount) * 100;
          const itemDiff = userWishEl.price - userMoneybox.totalAmount;
          const wishItemStatus = userWishEl.completed === false ? "false" : "true";

          return (
            <Row key={userWishEl._id} className="mb-4 mx-auto w-100">
              <Button
                onClick={() => handleExpand(userWishEl._id)}
                aria-controls={`collapse-wishEl-${userWishEl._id}`}
                aria-expanded={expandedItems[userWishEl._id]}
                variant="outline-primary"
                className={`${
                  wishItemStatus === "true" ? "singleWishBtnCompleted" : "singleWishBtn"
                }`}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="m-0">{userWishEl.content}</h5>
                  <p className="m-0">{userWishEl.price.toFixed(2)} €</p>
                  {wishItemStatus === "true" ? (
                    <Lottie
                      animationData={wishCompleteAnimation}
                      className="wishCompleteAnimation"
                      loop="0"
                    />
                  ) : null}
                </div>
              </Button>

              <Collapse in={expandedItems[userWishEl._id]}>
                <div
                  id={`collapse-wishEl-${userWishEl._id}`}
                  className={` mx-auto ${
                    theme === "light" ? "wishElCollapse" : "wishElCollapseDark"
                  }`}
                >
                  <p className={`mt-3`}>{userWishEl.description}</p>
                  {wishItemStatus === "true" ? (
                    <p className={`alertSingleWish text-center`}>
                      You have already bought this item!
                    </p>
                  ) : (
                    <p className={`alertSingleWish`}>
                      {userWishEl.price > userMoneybox.totalAmount
                        ? ` You need to save ${itemDiff.toFixed(2)} € to afford this item`
                        : `You should use the ${itemPercentage.toFixed(
                            2
                          )}% of your total Moneybox to afford
                  this item`}
                    </p>
                  )}

                  <div className="d-flex align-items-center gap-3 mb-2">
                    <Button
                      variant="danger"
                      onClick={() => {
                        setParams({ ...params, wishlistItemId: userWishEl._id });
                        handleDeleteWish();
                      }}
                      disabled={loadingDelete}
                    >
                      {loadingDelete ? "Removing..." : "Remove"}
                    </Button>
                    <Button
                      variant="outline-success"
                      className={`${wishItemStatus === "true" ? "d-none" : null}`}
                      disabled={userWishEl.price > userMoneybox.totalAmount}
                      onClick={() => {
                        setPurchaseParams({
                          ...purchaseParams,
                          productId: userWishEl._id,
                          moneyboxId: userMoneybox._id,
                        });
                        handleMoneyboxBuy();
                      }}
                    >
                      Buy with MoneyBox
                    </Button>
                  </div>
                </div>
              </Collapse>
            </Row>
          );
        })}
      </Row>
      <Row className="mx-auto newWishBtnWrapper w-100 mb-3">
        <Button variant="outline-secondary" className="newWishBtn" onClick={handleShowNewWish}>
          Make a wish
        </Button>

        <WishCanvass showNewWish={showNewWish} setShowNewWish={setShowNewWish} />
      </Row>
    </Container>
  );
};

export default Wishlist;
