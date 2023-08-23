import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const token = JSON.parse(localStorage.getItem("userLogged"));

const UsersContext = createContext();

const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVERBASE_URL}/users`, {
          headers: { Authorization: token },
        });
        setUsers(res.data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return <UsersContext.Provider value={{ users, setUsers }}>{children}</UsersContext.Provider>;
};

export { UsersContext, UsersProvider };
