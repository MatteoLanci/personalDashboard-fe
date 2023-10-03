import React, { useState, useEffect } from "react";

import { Button, Row, Col, Alert } from "react-bootstrap";

//! external libraries import
import jwtDecode from "jwt-decode";
import axios from "axios";
import { nanoid } from "nanoid";

import { useSelector } from "react-redux";

//! icons import
import { PiAlarm } from "react-icons/pi";
import { FaTrashAlt } from "react-icons/fa";

//! CSS import
import "./todo.css";

import Lottie from "lottie-react";
import todoAnimation from "../../assets/todo/animation_lmj95byh.json";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const theme = useSelector((state) => state.theme);

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);

  const [newTodoData, setNewTodoData] = useState({
    user: tokenDecoded.id,
    content: "",
    completed: false,
  });

  const fetchTodo = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${tokenDecoded.id}/todos`
      );
      setTodos(res.data.todos);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewTodo = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${tokenDecoded.id}/todos/create`,
        newTodoData
      );
      fetchTodo();
      setNewTodoData({ ...newTodoData, content: "" });
      return res.data;
    } catch (error) {
      console.log("Error occurs creating new ToDo: ", error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${tokenDecoded.id}/todos/${todoId}/delete`
      );
      fetchTodo();
      return res.data;
    } catch (error) {
      console.log("Error occurs deleting ToDo: ", error);
    }
  };

  const handleClearTodos = async () => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${tokenDecoded.id}/todos/delete-all`
      );
      fetchTodo();
      return res.data;
    } catch (error) {
      console.log("Error occurs deleting all ToDos: ", error);
    }
  };

  const handleCompleteTodo = async (todoId) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${tokenDecoded.id}/todos/${todoId}/edit`,
        { completed: !todos.find((todo) => todo._id === todoId).completed }
      );
      return res.data;
    } catch (error) {
      console.log("Error occurs editing todo in complete: ", error);
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) {
      return 0;
    }
    if (a.completed) {
      return 1;
    }
    return -1;
  });

  const formatExpireDate = (isoDate) => {
    const date = new Date(isoDate);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month} ${day} ${year}`;
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  return (
    <>
      <section className={`${theme === "light" ? "todosWrapper" : "todosWrapperDark"}`}>
        <Row>
          <h2 className="mb-4">Todos</h2>
          <Col xs={12} md={9}>
            {todos.length === 0 ? (
              <section className="d-flex flex-column gap-3 todoNoList">
                <Alert variant="light" className="text-center">
                  No ToDos on your list yet!
                </Alert>
                <input
                  type="text"
                  className="todoInput"
                  placeholder="Add a new task..."
                  value={newTodoData.content}
                  onChange={(e) => setNewTodoData({ ...newTodoData, content: e.target.value })}
                />
                <div>
                  <Button className="newTodoBtn" size="sm" onClick={handleNewTodo}>
                    Create
                  </Button>
                </div>
              </section>
            ) : (
              <>
                <ul key={nanoid()} className=" py-2 todoList  px-0">
                  {sortedTodos.map((todo) => (
                    <>
                      <li
                        key={todo._id}
                        className={` list-unstyled mb-2 ${
                          theme === "light" ? "singleTodoEl" : "singleTodoElDark"
                        }`}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <input
                              type="checkbox"
                              className="me-3"
                              checked={todo.completed}
                              onChange={() => handleCompleteTodo(todo._id)}
                              tabIndex="-1"
                            />
                            <span
                              style={
                                todo.completed
                                  ? { textDecoration: "line-through", color: "#28C773" }
                                  : {}
                              }
                            >
                              {todo.content}
                            </span>
                          </div>

                          <FaTrashAlt
                            className="mx-4 todoDelElBtn"
                            onClick={() => handleDeleteTodo(todo._id)}
                          />
                        </div>

                        <div
                          className="ms-4 d-flex align-items-center justify-content-start"
                          style={{ fontSize: ".7rem" }}
                        >
                          <PiAlarm className="mx-1" />
                          <span>{formatExpireDate(todo.expireDate)}</span>
                        </div>
                      </li>
                    </>
                  ))}
                </ul>

                <section className="d-flex flex-column">
                  <input
                    className="todoInput"
                    type="text"
                    placeholder="Add a new task..."
                    value={newTodoData.content}
                    onChange={(e) => setNewTodoData({ ...newTodoData, content: e.target.value })}
                  />

                  <div className="d-flex gap-4 mt-3">
                    <Button className="newTodoBtn" size="sm" onClick={handleNewTodo}>
                      Create
                    </Button>

                    <Button className="todoClearListBtn" size="sm" onClick={handleClearTodos}>
                      Clear List
                    </Button>
                  </div>
                </section>
              </>
            )}
          </Col>

          <Col xs={12} md={3}>
            <Lottie animationData={todoAnimation} loop={2} className="todoAnimation" />
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Todo;
