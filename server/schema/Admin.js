const mongoose = require("mongoose");

const admin = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  employeeType: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
});

const adminSchema = mongoose.model("Admin", admin);

module.exports = { Admin: adminSchema };
