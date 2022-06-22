const mongoose = require("mongoose");

const application = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  roles: {
    type: Array,
    required: true,
  },
});

const applicationSchema = mongoose.model("Application", application);

module.exports = { Application: applicationSchema };
