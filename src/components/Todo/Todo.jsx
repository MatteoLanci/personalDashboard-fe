import React, { useState, useEffect } from "react";

import { Button } from "react-bootstrap";

//! external libraries import
import jwtDecode from "jwt-decode";
import axios from "axios";
import { nanoid } from "nanoid";

//! icons import
import { PiTrashSimple } from "react-icons/pi";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [todoCompleted, setTodoCompleted] = useState(false);

  const token = JSON.parse(localStorage.getItem("userLogged"));
  const tokenDecoded = jwtDecode(token);

  const [newTodoData, setNewTodoData] = useState({
    user: tokenDecoded.id,
    content: "",
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

  const handleToggleTodo = (todoId) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  return (
    <>
      <div className="my-4">{tokenDecoded.firstName} Todos</div>
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
          <ul key={nanoid()}>
            {todos.map((todo) => (
              <>
                <li key={nanoid()} className="list-unstyled">
                  <input
                    key={nanoid()}
                    type="checkbox"
                    className="me-3"
                    checked={todoCompleted}
                    onChange={() => handleToggleTodo(todo._id)}
                  />
                  <span style={todo.completed ? { textDecoration: "line-through" } : {}}>
                    {todo.content}
                  </span>
                  <PiTrashSimple
                    key={nanoid()}
                    className="ms-2"
                    onClick={() => handleDeleteTodo(todo._id)}
                  />
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
            <Button key={nanoid()} variant="outline-primary" size="sm" onClick={handleNewTodo}>
              Create
            </Button>

            <Button key={nanoid()} variant="danger" size="sm" onClick={handleClearTodos}>
              Clear List
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default Todo;
