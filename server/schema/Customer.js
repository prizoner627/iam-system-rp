const mongoose = require("mongoose");

const customer = new mongoose.Schema({
  fullname: {
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

const customerSchema = mongoose.model("Customer", customer);

module.exports = { Customer: customerSchema };
