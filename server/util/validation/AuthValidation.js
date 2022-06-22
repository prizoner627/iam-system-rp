const Joi = require("joi");

const RegisterValidation = Joi.object({
  fullname: Joi.string().min(3).max(30).required().label("Fullname"),
  employeeId: Joi.string().max(10).required().label("Emaployee ID"),
  employeeType: Joi.string().max(15).required().label("Emaployee Type"),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(3)
    .max(30)
    .required()
    .label("Email"),
  password: Joi.string().required().label("Password"),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .label("Confirm Password"),
});

const UserRegisterValidation = Joi.object({
  fullname: Joi.string().min(3).max(30).required().label("Fullname"),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(3)
    .max(30)
    .required()
    .label("Email"),
  password: Joi.string().required().label("Password"),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .label("Confirm Password"),
});

const UserLoginValidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(3)
    .max(30)
    .required()
    .label("Email"),
});

//TODO: password complexity

const LoginValidation = Joi.object({
  employeeId: Joi.string().max(10).required().label("Emaployee ID"),
  password: Joi.string().required().label("Password"), //check password strength
});

const VerifyAdminValidation = Joi.object({
  employeeId: Joi.string().max(10).required().label("Emaployee ID"),
});

const CreateApplicationValidation = Joi.object({
  name: Joi.string().max(10).required().label("Name"),
  url: Joi.string().max(50).required().label("URL"),
  roles: Joi.array().required().label("roles"),
});

const DeleteApplicationValidation = Joi.object({
  name: Joi.string().max(20).required().label("Name"),
});

const CreateRoleValidation = Joi.object({
  name: Joi.string().max(20).required().label("Name"),
  label: Joi.string().max(20).required().label("label"),
  value: Joi.string().max(20).required().label("value"),
  description: Joi.string().max(100).required().label("description"),
});

module.exports = {
  RegisterValidation,
  LoginValidation,
  VerifyAdminValidation,
  CreateApplicationValidation,
  DeleteApplicationValidation,
  CreateRoleValidation,
  UserRegisterValidation,
  UserLoginValidation,
};
