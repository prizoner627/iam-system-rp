import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { Context } from "./Provider";

const AuthRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useContext(Context);
  console.log(currentUser);

  return currentUser?.authenticated && currentUser?.admin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default AuthRoute;
