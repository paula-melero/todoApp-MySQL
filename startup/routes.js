const express = require("express");
var compression = require("compression");
const error = require("../middleware/error");
const tasks = require("../routes/tasks");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function(app) {
  app.use(compression()); //Compress all routes
  app.use(express.json()); //if there is any JSON in request, parse it and set req.body
  app.use("/api/tasks", tasks);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
