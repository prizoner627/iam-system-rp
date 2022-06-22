const mongoose = require("mongoose");

const URI =
  "mongodb+srv://admin:lgDCwKv1x0kyQBAo@cluster0.wv48t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connect = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("database connected");
};

module.exports = connect;
