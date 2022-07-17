import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";

import { Context } from "./Provider";

const AuthRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useContext(Context);
  console.log(currentUser);

  return (
    <Route
      render={(props) =>
        currentUser?.authenticated && currentUser?.admin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
      {...rest}
    />
  );
};

export default AuthRoute;
