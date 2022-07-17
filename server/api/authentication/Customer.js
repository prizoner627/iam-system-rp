const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateKeyPair } = require("crypto");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cookie = require("cookie");

//schema
const { User } = require("../../schema/User");

//validation
const {
  UserRegisterValidation,
  UserLoginValidation,
} = require("../../util/validation/AuthValidation");

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
    expiresIn: "60min",
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

exports.UserRegister = async (req, res) => {
  try {
    console.log(req.body);
    const validated = await UserRegisterValidation.validateAsync(req.body);
    console.log(validated);

    // if (!validated) {
    //   return res.status(403).json({
    //     status: "403",
    //     message: error.message,
    //   });
    // }

    //check use exists
    const userExists = await User.findOne({
      email: validated.email,
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
    const data = new User({
      fullname: validated.fullname,
      email: validated.email,
      password: hash,
      createdAt: moment(new Date()).format("YYYY-MM-DD"),
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

exports.UserLogin = async (req, res) => {
  try {
    const validated = await UserLoginValidation.validateAsync(req.body);
    console.log(validated);

    //check user exists
    const user = await User.findOne({ email: validated.email });
    // console.log(user);

    if (!user) {
      return res.status(403).json({
        status: "403",
        message: "User not exists",
      });
    }

    //create and send magic link
    const tokenData = {
      username: validated.username,
      email: user.email,
    };

    const accessToken = signJWT(tokenData);

    const encryptedData = encryptData(accessToken);

    let from = "ebooksystemresearch@gmail.com";
    let to = user.email;
    let subject = "account conformations";
    let text = `User created successfully, Please verify your account using the link sent to your mentioned email address http://164.92.213.2:5001/verify-token?token=${encryptedData}`;

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
      // data: `http://164.92.213.2:5001/verify-token?token=${encryptedData}`,
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

exports.VerifyUserToken = async (req, res) => {
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
