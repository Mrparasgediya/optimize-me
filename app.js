const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const { allowed_origins } = require("./config.js");
require("./db/connection");

app.use(
  cors({
    origin: true,
  })
);

//  (origin, cb) => {
//    if (allowed_origins.indexOf(origin) === -1)
//      cb(new Error("You don\t have access"), null);
//    cb(null, true);
//  },
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const imageRoutes = require("./routes/image");
app.use(imageRoutes);

module.exports = app;
