import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Admins from "./pages/Admins";
import Applications from "./pages/Applications";
import Roles from "./pages/Roles";
import UserRegister from "./pages/UserRegister";

import Provider from "./util/Provider";
import AuthRoute from "./util/AuthRoute";
import ViewLogs from "./pages/ViewLogs";
import Users from "./pages/Users";

const theme1 = createTheme({
  typography: {
    h1: {
      fontFamily: "AirbnbCerealMedium",
    },
    h2: {
      fontFamily: "AirbnbCerealMedium",
    },
    h3: {
      fontFamily: "AirbnbCerealMedium",
    },
    h4: {
      fontFamily: "AirbnbCerealMedium",
    },
    h5: {
      fontFamily: "AirbnbCerealMedium",
    },
    h6: {
      fontFamily: "AirbnbCerealBook",
    },
    body1: {
      fontFamily: "AirbnbCerealBook",
    },
    body2: {
      fontFamily: "AirbnbCerealBook",
    },
    p: {
      fontFamily: "AirbnbCerealBook",
    },
    overline: {
      fontFamily: "AirbnbCerealMedium",
    },
    button: { fontFamily: "AirbnbCerealBook" },
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  palette: {
    primary: {
      main: "#000080",
    },
    secondary: {
      main: "#B2BEB5",
    },
  },
});

let theme = responsiveFontSizes(theme1);

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Provider>
          <BrowserRouter>
            <BrowserRouter>
              {/* 
              <Route exact path="/" component={Landing} /> */}
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              {/* <Route exact path="/" component={<Home />} /> */}
              <AuthRoute path="/admins" component={Admins} />
              <AuthRoute path="/users" component={Users} />
              <AuthRoute exact path="/" component={Applications} />
              <AuthRoute path="/roles" component={Roles} />
              <AuthRoute path="/user-register" component={UserRegister} />
              <AuthRoute path="/view-logs/:id" component={ViewLogs} />

              {/* <AuthRoute path="/profile" component={Profile} /> */}
              {/* <Route component={NotFound} /> */}
            </BrowserRouter>
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
