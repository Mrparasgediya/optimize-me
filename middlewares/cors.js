const cors = require("cors");
const { allowed_origins } = require("../config");

const enableCors = cors({
  methods: "GET,PUT,POST,DELETE",
  origin: (origin, cb) => {
    if (allowed_origins.indexOf(origin) === -1)
      cb(new Error("You don\t have access"), null);
    cb(null, true);
  },
});

module.exports = { enableCors };
