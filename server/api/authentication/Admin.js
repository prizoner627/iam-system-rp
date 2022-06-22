const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateKeyPair } = require("crypto");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cookie = require("cookie");

//schema
const { Admin } = require("../../schema/Admin");
const { Log } = require("../../schema/Logs");
const { Application } = require("../../schema/Application");
const { Role } = require("../../schema/Role");
const { User } = require("../../schema/User");

//validation
const {
  RegisterValidation,
  LoginValidation,
  VerifyAdminValidation,
  CreateApplicationValidation,
  CreateRoleValidation,
  DeleteApplicationValidation,
} = require("../../util/validation/AuthValidation");

// TODO: login register vefirication routes
// TODO: magic links (use jwt or rsa encryption)
// TODO: add logging and auditing to auth routes

function encryptData(data) {
  const algorithm = "aes-256-cbc";

  // generate 16 bytes of random data
  const initVector = Buffer.from(process.env.IV, "hex");

  // secret key generate 32 bytes of random data
  const Securitykey = Buffer.from(process.env.SECRET, "hex");

  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

  // encrypt the message
  // input encoding
  // output encoding
  let encryptedData = cipher.update(data, "utf-8", "hex");

  encryptedData += cipher.final("hex");

  console.log("Encrypted message: " + encryptedData);

  return encryptedData;
}

const decryptData = async (data) => {
  try {
    const algorithm = "aes-256-cbc";

    // generate 16 bytes of random data
    const initVector = Buffer.from(process.env.IV, "hex");

    // secret key generate 32 bytes of random data
    const Securitykey = Buffer.from(process.env.SECRET, "hex");

    // the decipher function
    const decipher = crypto.createDecipheriv(
      algorithm,
      Securitykey,
      initVector
    );

    let decryptedData = decipher.update(data, "hex", "utf-8");

    decryptedData += decipher.final("utf8");

    console.log("Decrypted message: " + decryptedData);

    return decryptedData;
  } catch (err) {
    console.log(err);
    return false;
  }
};

function signJWT(data) {
  //create jwt token
  let accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "300min",
    algorithm: "HS512",
  });

  return accessToken;
}

function verifyJWT(token) {
  // verify a token symmetric
  return jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, decoded) {
      if (err) {
        throw new Error("Unauthorized");
      }

      console.log(decoded);

      return decoded;
    }
  );
}

async function sendMail(from, to, subject, text) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ebooksystemresearch@gmail.com",
      pass: "R3seach@3book#",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: from, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    // html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);

  return;
}

async function logger() {}

exports.Register = async (req, res) => {
  try {
    console.log(req.body);
    const validated = await RegisterValidation.validateAsync(req.body);
    console.log(validated);

    // if (!validated) {
    //   return res.status(403).json({
    //     status: "403",
    //     message: error.message,
    //   });
    // }

    //check use exists
    const userExists = await Admin.findOne({
      employeeId: validated.employeeId,
    });

    if (userExists) {
      return res.status(403).json({
        status: "403",
        message: "User already exists",
      });
    }

    //compare two passwords
    if (validated.password !== validated.confirmPassword) {
      return res.status(403).json({
        status: "403",
        message: "Password does not match",
      });
    }

    //generate hash
    const hash = bcrypt.hashSync(validated.password, 10);
    console.log(hash);

    //create user
    const data = new Admin({
      employeeId: validated.employeeId,
      fullname: validated.fullname,
      employeeType: validated.employeeType,
      email: validated.email,
      password: hash,
      createdAt: moment(new Date()).format("YYYY-MM-DD"),
      verified: false,
    });

    const result = await data.save();
    console.log(result);

    return res.status(201).json({
      status: "201",
      message: "Account Successfully Created, Please Login",
    });
  } catch (err) {
    console.log(err);

    if (err.code === 11000) {
      return res.status(500).json({
        status: "500",
        message: "Please provide your own details",
        data: null,
      });
    } else {
      return res.status(500).json({
        status: "500",
        message: "Something went wrong, please try again later",
        data: null,
      });
    }
  }
};

exports.Login = async (req, res) => {
  try {
    const validated = await LoginValidation.validateAsync(req.body);
    console.log(validated);

    //check user exists
    const user = await Admin.findOne({ employeeId: validated.employeeId });
    // console.log(user);

    if (!user) {
      return res.status(403).json({
        status: "403",
        message: "Employee id or password is invalid",
      });
    }

    //compare hash
    const verify = bcrypt.compareSync(validated.password, user.password);
    console.log(verify);

    if (!verify) {
      return res.status(403).json({
        status: "403",
        message: "Employee id or password is invalid",
      });
    }

    //check account is verified??
    if (!user.verified) {
      return res.status(403).json({
        status: "403",
        message: "User is not authorized, please contact administrator",
      });
    }

    //create and send magic link
    const tokenData = {
      employeeId: validated.employeeId,
      employeeType: user.employeeType,
      email: user.email,
      verified: user.verified,
    };

    const accessToken = signJWT(tokenData);

    const encryptedData = encryptData(accessToken);

    let from = "ebooksystemresearch@gmail.com";
    let to = user.email;
    let subject = "account conformations";
    let text = `User created successfully, Please verify your account using the link sent to your mentioned email address http://localhost:5001/verify-token?token=${encryptedData}`;

    const mail = await sendMail(from, to, subject, text);

    // //set cookies
    // res.cookie("jwtToken", token, {
    //   maxAge: new Date(new Date().valueOf() + 1000 * 3600 * 24), // 1 day
    //   httpOnly: false, //set this to true in production
    //   path: "/",
    //   secure: false,
    //   sameSite: true,
    // });

    return res.status(201).json({
      status: "201",
      message: "User verified successfully, please check your email.",
      // data: `http://localhost:5001/verify-token?token=${encryptedData}`,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.VerifyToken = async (req, res) => {
  try {
    console.log(req.query.token);

    const decryptedData = await decryptData(req.query.token);
    console.log(decryptedData, "decryptedData");

    if (decryptedData) {
      const decodedToken = verifyJWT(decryptedData);

      console.log(decodedToken);
      let employeeType = decodedToken.employeeType;

      const app = await Application.findOne({ "roles.value": employeeType });
      console.log(app);

      if (!app) {
        return res.status(500).json({
          status: "500",
          message: "Invalid User Type",
          // data: err,
        });
      }

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("jwtToken", decryptedData, {
          maxAge: 60 * 60 * 24, // 1 day
          httpOnly: false, //set this to true in production
          path: "/",
          secure: false,
          // sameSite: true,
        })
      );

      res.redirect(302, app.url);
    } else {
      return res.status(403).json({
        status: "403",
        message: "Unauthorized",
      });
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: err,
    });
  }
};

exports.GetAdmins = async (req, res) => {
  try {
    console.log(req.query.token);

    const data = await Admin.find(
      {},
      {
        employeeId: 1,
        fullname: 1,
        employeeType: 1,
        email: 1,
        createdAt: 1,
        verified: 1,
      }
    );

    console.log(data);

    return res.status(201).json({
      status: "200",
      message: "",
      data: data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.VerifyAdmin = async (req, res) => {
  try {
    console.log(req.body);

    const validated = await VerifyAdminValidation.validateAsync(req.body);
    console.log(validated);

    const result = await Admin.findOneAndUpdate(
      { employeeId: validated.employeeId },
      { $set: { verified: true } }
    );

    return res.status(201).json({
      status: "201",
      message: "User verified successfully",
      // data: decryptedData,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.DeleteAdmin = async (req, res) => {
  try {
    console.log(req.body);

    const validated = await VerifyAdminValidation.validateAsync(req.body);
    console.log(validated);

    const result = await Admin.findOneAndUpdate({
      employeeId: validated.employeeId,
    });

    return res.status(201).json({
      status: "201",
      message: "User deleted successfully",
      // data: decryptedData,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.CreateApplication = async (req, res) => {
  try {
    console.log(req.body);

    const validated = await CreateApplicationValidation.validateAsync(req.body);
    console.log(validated);

    const NewApp = new Application({
      name: validated.name,
      url: validated.url,
      roles: validated.roles,
    });

    const result = await NewApp.save();

    return res.status(201).json({
      status: "201",
      message: "Application created successfully",
      // data: decryptedData,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.DeleteApplication = async (req, res) => {
  try {
    console.log(req.body);

    const validated = await DeleteApplicationValidation.validateAsync(req.body);
    console.log(validated);

    const NewApp = await Application.findOneAndDelete({
      name: validated.name,
    });

    return res.status(201).json({
      status: "201",
      message: "Application deleted successfully",
      // data: decryptedData,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.CreateRole = async (req, res) => {
  try {
    console.log(req.body);

    const validated = await CreateRoleValidation.validateAsync(req.body);
    console.log(validated);

    const NewRole = new Role({
      name: validated.name,
      label: validated.label,
      value: validated.value,
      description: validated.description,
    });

    const result = await NewRole.save();

    return res.status(201).json({
      status: "201",
      message: "Role created successfully",
      // data: decryptedData,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.GetRoles = async (req, res) => {
  try {
    const roles = await Role.find({});

    console.log(roles);

    return res.status(201).json({
      status: "201",
      message: "Role found successfully",
      data: roles,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.GetApplications = async (req, res) => {
  try {
    // let log = logger("GetApplications",)

    const apps = await Application.find({});

    console.log(apps);

    return res.status(201).json({
      status: "200",
      message: "Apps found successfully",
      data: apps,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.GetLogs = async (req, res) => {
  try {
    // let log = logger("GetApplications",)
    let emp = req.body.employeeId;
    console.log(req.body.employeeId);
    const logs = await Log.find({ user: emp }).sort({ time: -1 }).limit(20);

    console.log(logs);

    return res.status(201).json({
      status: "200",
      message: "logs found successfully",
      data: logs,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.GetUsers = async (req, res) => {
  try {
    const users = await User.find({});

    console.log(users);

    return res.status(201).json({
      status: "200",
      message: "users found successfully",
      data: users,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.Logout = async (req, res) => {
  try {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("jwtToken", "", {
        maxAge: 60 * 60 * 24, // 1 day
        httpOnly: false, //set this to true in production
        path: "/",
        secure: false,
        // sameSite: true,
      })
    );

    return res.status(201).json({
      status: "200",
      message: "logout successfully",
      data: null,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};
