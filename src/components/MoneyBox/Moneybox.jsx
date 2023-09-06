import React, { useEffect } from "react";

import jwtDecode from "jwt-decode";
import { nanoid } from "nanoid";

import { Container, Row, Col, Button } from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";

import { usersState } from "../../state/Reducers/usersSlice";
import { getMoneybox } from "../../state/Reducers/moneyboxSlice";
import { getUserTransactions } from "../../state/Reducers/moneyboxSlice";

const Moneybox = () => {
  const dispatch = useDispatch();

  const users = useSelector(usersState);
  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);
  const user = users.find((user) => user._id === tokenDecoded.id);

  const moneybox = useSelector((state) => state.moneybox.moneybox);
  const userTransactions = useSelector((state) => state.moneybox.transactions);
  console.log(userTransactions);
  console.log(moneybox);

  const moneyboxId = moneybox._id;
  const userId = user._id;

  useEffect(() => {
    setTimeout(() => {
      dispatch(getMoneybox(user._id));
    }, 3000);
  }, [dispatch, user._id]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(getUserTransactions({ userId, moneyboxId }));
    }, 3000);
  }, [moneyboxId, userId, dispatch]);

  return (
    <Container className="border rounded p-2">
      <h2> {user.firstName}'s MoneyBox</h2>
      <p>Total Amount: {moneybox.totalAmount} </p>
      <div>
        <input type="text" placeholder="e.g. 500" />
        <button>Add</button>
      </div>

      <ul className="mt-5">Latest Transactions</ul>
      {userTransactions.userTransactions.latestTransactions.map((transaction) => (
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
