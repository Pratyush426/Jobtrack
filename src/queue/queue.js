const Bull = require("bull");
require("dotenv").config();

const emailQueue = new Bull("email-queue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  }
});

module.exports = emailQueue;
