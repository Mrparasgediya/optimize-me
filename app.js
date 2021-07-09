const express = require("express");
const path = require("path");
const app = express();
require("./db/connection");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const imageRoutes = require("./routes/image");
app.use(imageRoutes);

module.exports = app;
