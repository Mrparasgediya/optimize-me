const mongoose = require("mongoose");
const { mongodb_connection_url } = require("../config");
mongoose.connect(
  mongodb_connection_url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (error) => {
    if (error) console.log("mongoose connection error ", error);
    else console.log("successfull connection to db");
  }
);
