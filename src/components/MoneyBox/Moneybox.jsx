import React, { useEffect } from "react";

import jwtDecode from "jwt-decode";

import { useSelector, useDispatch } from "react-redux";

import { usersState } from "../../state/Reducers/usersSlice";
import { getMoneybox } from "../../state/Reducers/moneyboxSlice";

const Moneybox = () => {
  const dispatch = useDispatch();

  const users = useSelector(usersState);
  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);
  const user = users.find((user) => user._id === tokenDecoded.id);

  const moneybox = useSelector((state) => state.moneybox.moneybox);

  useEffect(() => {
    dispatch(getMoneybox(user._id));
  }, [dispatch, user._id]);

  return (
    <>
      <h2> {user.firstName}'s MoneyBox</h2>
      <p>Total Amount: {moneybox.totalAmount} </p>
    </>
  );
};

export default Moneybox;
