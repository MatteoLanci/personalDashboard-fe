import React, { useEffect, useState } from "react";

import jwtDecode from "jwt-decode";
import { nanoid } from "nanoid";

import { Container, Button, Row, Col, Alert } from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";

import { usersState } from "../../state/Reducers/usersSlice";
import { transactionState } from "../../state/Reducers/transactionsSlice";
import { getMoneybox, moneyboxState } from "../../state/Reducers/moneyboxSlice";
import { getUserTransactions } from "../../state/Reducers/transactionsSlice";
import { handleNewTransaction } from "../../state/Reducers/transactionsSlice";
import { createMoneybox } from "../../state/Reducers/moneyboxSlice";

import Lottie from "lottie-react";
import moneyboxAnimation from "../../assets/moneybox/moneybox_animation.json";
import noTransactionAnimation from "../../assets/moneybox/noTransactions_animation.json";

import "./moneybox.css";

const Moneybox = () => {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme);
  const moneybox = useSelector(moneyboxState);
  const users = useSelector(usersState);
  const userTransactions = useSelector(transactionState);

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);
  const user = users.find((user) => user._id === tokenDecoded.id);
  const userId = user._id;
  const userMoneybox = user.moneybox;

  const [moneyboxIdLoading, setMoneyboxIdLoading] = useState(true);

  const [transactionData, setTransactionData] = useState({
    value: "",
    description: "",
  });

  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const handleAddTransaction = () => {
    if (!transactionData.value || isNaN(parseFloat(transactionData.value))) {
      return;
    }
    dispatch(handleNewTransaction({ userId, moneyboxId, transactionData }))
      .then(() => {
        dispatch(getMoneybox(user._id));
        dispatch(getUserTransactions({ userId, moneyboxId }));
      })
      .then(() => {
        setTransactionData({ value: "", description: "" });
      });
  };

  useEffect(() => {
    dispatch(getMoneybox(user._id))
      .then(() => {
        setMoneyboxIdLoading(false);
      })
      .catch((error) => {
        console.error("Error getting moneybox:", error);
      });
  }, [dispatch, user._id]);

  const moneyboxId = moneyboxIdLoading ? null : moneybox._id;

  useEffect(() => {
    if (moneyboxId) {
      dispatch(getUserTransactions({ userId, moneyboxId }))
        .then(() => {})
        .catch((error) => {
          console.error("Error getting transactions:", error);
        });
    }
  }, [dispatch, userId, moneyboxId, user]);

  const sortedUserTransactions = userTransactions
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const displayedTransactions = showAllTransactions
    ? sortedUserTransactions
    : sortedUserTransactions.slice(0, 3);

  const handleLoadToggle = () => {
    setShowAllTransactions(!showAllTransactions);
  };

  function getDateString(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toDateString(undefined, options);
  }

  const handleCreateMoneybox = () => {
    dispatch(createMoneybox(userId))
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error creating moneybox:", error);
      });
  };

  if (!userMoneybox) {
    return (
      <Container
        className={`${theme === "light" ? "moneyboxWrapper" : "moneyboxWrapperDark"} 
        d-flex flex-column justify-content-start align-items-center `}
      >
        <div className="d-flex justify-content-start align-items-center">
          <h2 className="m-0">MoneyBox</h2>
          <Lottie animationData={moneyboxAnimation} className="moneyboxAnimation" />
        </div>
        <Alert variant="danger">
          You haven't created your moneybox yet, click the button below to start saving for your
          dreams
        </Alert>
        <Button className="createMoneyboxBtn" onClick={handleCreateMoneybox}>
          Create Personal Moneybox
        </Button>
      </Container>
    );
  }

  return (
    <Container
      className={`${theme === "light" ? "moneyboxWrapper" : "moneyboxWrapperDark text-light"}`}
    >
      <div className="d-flex justify-content-start align-items-center">
        <h2 className={`m-0`}>MoneyBox</h2>
        <Lottie animationData={moneyboxAnimation} className="moneyboxAnimation" />
      </div>
      <p className="m-0 text-center">Your Total Savings:</p>
      <h4 className="text-center fs-1 mb-3">{parseFloat(moneybox.totalAmount).toFixed(2)} €</h4>
      <Row className="d-flex justify-content-center align-items-center">
        <Col xs={12} md={6} className="text-center">
          <input
            className={`${theme === "light" ? "moneyboxInput" : "moneyboxInputDark"}`}
            type="text"
            placeholder="e.g. 500"
            value={transactionData.value}
            onChange={(e) => setTransactionData({ ...transactionData, value: e.target.value })}
          />
        </Col>

        <Col xs={12} md={6} className="text-center">
          <input
            className={`${theme === "light" ? "moneyboxInput" : "moneyboxInputDark"}`}
            type="text"
            placeholder="e.g. new personal income"
            value={transactionData.description}
            onChange={(e) =>
              setTransactionData({ ...transactionData, description: e.target.value })
            }
          />
        </Col>
      </Row>

      <div className="text-center">
        <Button
          variant="success"
          className="mt-4 w-100 mx-auto newTransactionBtn"
          disabled={transactionData.value === "" || transactionData.description === ""}
          onClick={handleAddTransaction}
        >
          Add Founds
        </Button>
      </div>

      <ul className="mt-3 p-0">Latest Transactions :</ul>
      {displayedTransactions.map((transaction) => (
        <div
          key={nanoid}
          className={` mb-2 ${theme === "light" ? "singleTransaction" : "singleTransactionDark"}`}
        >
          <div className={`d-flex justify-content-center align-items-center gap-2`}>
            <article>+ {parseFloat(transaction.value).toFixed(2)} €</article>
            <em className="transactionDesc">( {transaction.description} )</em>
          </div>

          <em className="transactionCreatedAt">Added on {getDateString(transaction.createdAt)}</em>
        </div>
      ))}

      {displayedTransactions.length === 0 && (
        <div className="mx-auto w-100">
          <Lottie animationData={noTransactionAnimation} className="noTransactionAnimation" />
          <Alert variant="warning" className=" mt-2 text-center">
            No transactions yet, start saving something today!
          </Alert>
        </div>
      )}

      <div className="mt-5">
        <Button
          variant="primary"
          className={`loadTransactionsBtn mt-2 ${
            displayedTransactions.length === 0 ? "d-none" : ""
          }`}
          onClick={handleLoadToggle}
        >
          {showAllTransactions ? "Show Less" : "Load More"}
        </Button>
      </div>
    </Container>
  );
};

export default Moneybox;
