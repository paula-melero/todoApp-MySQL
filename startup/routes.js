const express = require("express");
const path = require("path");
var compression = require("compression");
const error = require("../middleware/error");
const tasks = require("../routes/tasks");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function(app) {
  app.use(compression()); //Compress all routes
  app.use(express.json()); //req.body for any JSON
  app.use("/api/tasks", tasks);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
