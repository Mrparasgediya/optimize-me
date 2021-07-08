const result = require("dotenv").config();

if (result.error) console.log(result.error);

module.exports = {
  allowed_origins: process.env.ALLOWED_ORIGINS,
  app_domain: process.env.APP_DOMAIN,
  mongodb_connection_url: process.env.MONGODB_CONNECTION_URL,
};
