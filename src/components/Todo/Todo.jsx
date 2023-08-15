import React, { useState, useEffect } from "react";

import { Button } from "react-bootstrap";

//! external libraries import
import jwtDecode from "jwt-decode";
import axios from "axios";
import { nanoid } from "nanoid";

//! icons import
import { PiTrashSimple, PiAlarm } from "react-icons/pi";

//! CSS import
import "./todo.css";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  // const [todoCompleted, setTodoCompleted] = useState(false);

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
      <section className="todosWrapper">
        <div className="mb-4">{tokenDecoded.firstName} Todos</div>
        {todos.length === 0 ? (
          <>
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTodoData.content}
              onChange={(e) => setNewTodoData({ ...newTodoData, content: e.target.value })}
            />
            <Button variant="outline-primary" size="sm" onClick={handleNewTodo}>
              Create
            </Button>
          </>
        ) : (
          <>
            <ul key={nanoid()} className="p-0">
              {sortedTodos.map((todo) => (
                <>
                  <li key={nanoid()} className="list-unstyled mb-3">
                    <div className="d-flex justify-content-start align-items-center">
                      <input
                        key={nanoid()}
                        type="checkbox"
                        className="me-3"
                        checked={todo.completed}
                        onChange={() => handleCompleteTodo(todo._id)}
                      />
                      <span
                        style={
                          todo.completed ? { textDecoration: "line-through", color: "#28C773" } : {}
                        }
                      >
                        {todo.content}
                      </span>

                      <PiTrashSimple
                        key={nanoid()}
                        className="mx-4 text-danger"
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
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTodoData.content}
              onChange={(e) => setNewTodoData({ ...newTodoData, content: e.target.value })}
            />

            <div className="d-flex gap-4 mt-3">
              <Button key={nanoid()} variant="primary" size="sm" onClick={handleNewTodo}>
                Create
              </Button>

              <Button key={nanoid()} variant="danger" size="sm" onClick={handleClearTodos}>
                Clear List
              </Button>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Todo;
