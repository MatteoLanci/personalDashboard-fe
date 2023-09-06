import React, { useEffect, useState } from "react";

import jwtDecode from "jwt-decode";
import { nanoid } from "nanoid";

import { Container, Row, Col, Button } from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";

import { usersState } from "../../state/Reducers/usersSlice";
import { transactionState } from "../../state/Reducers/transactionsSlice";
import { getMoneybox } from "../../state/Reducers/moneyboxSlice";
import { getUserTransactions } from "../../state/Reducers/transactionsSlice";
import { handleNewTransaction } from "../../state/Reducers/transactionsSlice";

const Moneybox = () => {
  const dispatch = useDispatch();

  const moneybox = useSelector((state) => state.moneybox.moneybox);
  const users = useSelector(usersState);
  const userTransactions = useSelector(transactionState);

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);
  const user = users.find((user) => user._id === tokenDecoded.id);
  const userId = user._id;

  const [moneyboxIdLoading, setMoneyboxIdLoading] = useState(true);

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
  }, [dispatch, userId, moneyboxId]);

  const [transactionData, setTransactionData] = useState({
    value: "",
    description: "",
  });

  const handleAddTransaction = () => {
    if (!transactionData.value || isNaN(parseFloat(transactionData.value))) {
      return;
    }
    dispatch(handleNewTransaction({ userId, moneyboxId, transactionData }));
  };

  return (
    <Container className="border rounded p-2">
      <h2> {user.firstName}'s MoneyBox</h2>
      <p>Total Amount: {moneybox.totalAmount} </p>
      <div>
        <input
          type="text"
          placeholder="e.g. 500"
          onChange={(e) => setTransactionData({ ...transactionData, value: e.target.value })}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="e.g. new personal income"
          onChange={(e) => setTransactionData({ ...transactionData, description: e.target.value })}
        />
      </div>
      <Button variant="success" className="mt-2" onClick={handleAddTransaction}>
        Add Transaction
      </Button>

      <ul className="mt-5">Latest Transactions</ul>
      {userTransactions.map((transaction) => (
        <li key={nanoid}>
          <div>{transaction.value}</div>
          <div>{transaction.description}</div>
          <div>{transaction.createdAt}</div>
        </li>
      ))}
    </Container>
  );
};

export default Moneybox;
