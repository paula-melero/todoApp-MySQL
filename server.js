require("dotenv").config();
const config = require("config");
const winston = require("winston");
const express = require("express");
const app = express();
const path = require("path");
const index_path = path.join(__dirname, "/public");

require("./startup/routes")(app);
require("./startup/db")(process.env);
require("./startup/logging")();
require("./startup/config")();

app.get("/", (req, res) => {
  res.sendFile(index_path);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});

//export server obj to use with integration tests
module.exports = server;
