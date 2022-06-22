const mongoose = require("mongoose");

const log = new mongoose.Schema({
  url: {
    type: String,
    required: false,
  },
  ip: {
    type: String,
    required: false,
  },
  agent: {
    type: Object,
    required: false,
  },
  user: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
});

const logSchema = mongoose.model("Log", log);

module.exports = { Log: logSchema };
