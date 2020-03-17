const config = require("config");
const winston = require("winston");
const express = require("express");
const app = express();
const cors = require("cors");

const sequelize = require("./startup/db");
const { User } = require("./models/user");
const { Task } = require("./models/task");

//cors
const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: true,
  allowedHeaders: ["x-auth-token", "Content-Type"],
  exposedHeaders: ["x-auth-token"]
};
app.use(cors(corsOptions));

require("./startup/routes")(app);
require("./startup/db");
require("./startup/logging")();
require("./startup/config")();

//RELATIONSHIPS
Task.belongsTo(User, {
  onDelete: "CASCADE"
});
User.hasMany(Task);
//create db tables according to defined models
sequelize
  .sync()
  .then(result => {
    winston.info(`Successfully updated db tables in ${result.options.host}`);
  })
  .catch(err => {
    winston.error(err.message);
  });

const port = config.get("port") || 3000;
const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});
//export server obj to use with integration tests
module.exports = server;
