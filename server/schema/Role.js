const mongoose = require("mongoose");

const role = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
});

const roleSchema = mongoose.model("Role", role);

module.exports = { Role: roleSchema };
