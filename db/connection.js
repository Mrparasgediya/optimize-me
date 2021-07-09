const mongoose = require("mongoose");
const { mongodb_connection_url } = require("../config");
console.log("this is mongodb connectionurl , ", mongodb_connection_url);
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
