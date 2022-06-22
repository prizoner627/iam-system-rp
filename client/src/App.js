import { BrowserRouter, Routes, Route } from "react-router-dom";
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
            <Routes>
              {/* 
              <Route exact path="/" component={Landing} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route exact path="/" element={<Home />} /> */}
              <Route path="/admins" element={<Admins />} />
              <Route path="/users" element={<Users />} />
              <Route exact path="/" element={<Applications />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/user-register" element={<UserRegister />} />
              <Route path="/view-logs/" element={<ViewLogs />}>
                <Route path=":id" element={<ViewLogs />}></Route>
              </Route>

              {/* <AuthRoute path="/profile" component={Profile} /> */}
              {/* <Route component={NotFound} /> */}
            </Routes>
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
