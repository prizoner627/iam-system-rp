import React, { useEffect, useState } from "react";
import axios from "axios";

import { CircularProgress } from "@mui/material";

export const Context = React.createContext();

export const Provider = ({ children }) => {
  console.log("context");

  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    console.log("context");
    axios
      .get("http://164.92.213.2:5001/authenticated", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setCurrentUser({ authenticated: true, admin: true });
        setPending(false);
      })
      .catch((error) => {
        setPending(false);
        setCurrentUser(null);
      });
  }, []);

  console.log(currentUser);

  if (pending) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="inherit"></CircularProgress>
      </div>
    );
  }

  return (
    <Context.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
