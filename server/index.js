//imports
const express = require("express");
const cors = require("cors");
const connect = require("./util/Connection");
const cookieParser = require("cookie-parser");
const cookie = require("cookie");
// const fs = require("fs");
const RequestIp = require("@supercharge/request-ip");
const useragent = require("express-useragent");
const moment = require("moment");
const jwt = require("jsonwebtoken");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
require("dotenv").config();

//server configurations
connect();
var app = express();
// app.use(helmet());
// app.use(helmet.frameguard({ action: "deny" }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: ["http://164.92.213.2:3000", "http://164.92.213.2:3001"],
    credentials: true,
  })
);
app.use(useragent.express());
app.use(cookieParser());

const { Log } = require("./schema/Logs");

const logger = async (fullUrl, ip, agent, time, user) => {
  // console.log(fullUrl, ip, agent, time);

  const LogData = new Log({
    url: fullUrl,
    ip: ip,
    agent: agent,
    time: time,
    user: user,
  });

  const data = await LogData.save();
};

//helpers
const auth = async (req, res, next) => {
  console.log(req.cookies.jwtToken);

  if (!req.cookies.jwtToken) {
    return res.status(403).json({
      message: "Unauthorized",
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(
      req.cookies.jwtToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (decoded) {
      var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
      const ip = RequestIp.getClientIp(req);
      const agent = req.useragent;
      const time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      const emp = decoded.employeeId;
      const log = await logger(fullUrl, ip, agent, time, emp);

      next();
    }
  } catch (e) {
    console.log(e);

    return res.status(403).json({
      message: "Unauthorized",
      data: null,
    });
  }
};

//routes imports
const {
  Register,
  Login,
  VerifyToken,
  GetAdmins,
  VerifyAdmin,
  DeleteAdmin,
  CreateApplication,
  DeleteApplication,
  CreateRole,
  GetRoles,
  GetApplications,
  GetLogs,
  GetUsers,
  Logout,
} = require("./api/authentication/Admin");

const {
  UserRegister,
  UserLogin,
  VerifyUserToken,
} = require("./api/authentication/Customer");

//routes
app.post("/admin-login", Login);
app.post("/admin-register", Register);
app.get("/verify-token", VerifyToken);
app.get("/get-admins", auth, GetAdmins);
app.post("/verify-admin", auth, VerifyAdmin);
app.post("/delete-admin", auth, DeleteAdmin);
app.post("/create-application", auth, CreateApplication);
app.post("/delete-application", auth, DeleteApplication);
app.post("/create-role", auth, CreateRole);
app.get("/get-roles", auth, GetRoles);
app.get("/get-applications", auth, GetApplications);
app.post("/get-logs", auth, GetLogs);
app.get("/get-users", auth, GetUsers);
app.get("/logout", Logout);

app.post("/user-register", UserRegister);
app.post("/user-login", UserLogin);
app.post("/verify-user-token", VerifyUserToken);

app.get("/authenticated", auth, (req, res) => {
  return res.status(200).json({ message: "hello" });
});

app.get("/", (req, res) => {
  return res.status(200).json({ message: "hello" });
});

var server = app.listen(5001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
