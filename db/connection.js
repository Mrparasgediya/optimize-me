const mongoose = require("mongoose");
const { mongodb_connection_url } = require("../config");
mongoose.connect(mongodb_connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
