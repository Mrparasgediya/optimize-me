const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
require("./db/connection");
const { allowed_origins } = require("./config");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, cb) => {
      if (allowed_origins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("You don't have access"), null);
      }
    },
  })
);

const imageRoutes = require("./routes/image");
app.use(imageRoutes);

module.exports = app;
