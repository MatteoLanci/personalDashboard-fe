import React, { useEffect, useState } from "react";
import "./welcomeDate.css";
import { FcCalendar } from "react-icons/fc";
import jwtDecode from "jwt-decode";
import axios from "axios";

import { usersState } from "../../state/Reducers/usersSlice";
import { useSelector } from "react-redux";

const WelcomeDate = () => {
  const theme = useSelector((state) => state.theme);
  const [randomQuote, setRandomQuote] = useState("");

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);
  const users = useSelector(usersState);
  const user = users.find((user) => user._id === tokenDecoded.id);
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    locale: "en-US",
  };
  const formattedDate = date.toDateString(undefined, options);
  const dayOfMonth = date.getDate();

  const getRandomQuote = async () => {
    try {
      const response = await axios.get("https://api.quotable.io/random");
      const quote = response.data;
      return quote;
    } catch (error) {
      console.error("Error fetching random quote:", error);
      return "An error occurred while fetching the quote.";
    }
  };

  useEffect(() => {
    async function fetchRandomQuote() {
      const quote = await getRandomQuote();
      setRandomQuote(quote);
    }
    fetchRandomQuote();
  }, []);

  return (
    <>
      <section className={`${theme === "light" ? "welcomeWrapper" : "welcomeWrapperDark"}`}>
        <div>
          <h4>Welcome back {user?.firstName}</h4>
          <h5>today is {formattedDate}</h5>

          <div className="quoteWrapper">
            <p className="quoteContent">{randomQuote.content}</p>
            <em className="quoteAuthor">{randomQuote.author}</em>
          </div>
        </div>

        <div className="calendarWrapper">
          <FcCalendar className="calendarIcon" />
          <span className="dayOfMonth">{dayOfMonth}</span>
        </div>
      </section>
    </>
  );
};

export default WelcomeDate;
