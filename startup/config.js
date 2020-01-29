const config = require("config");
const express = require("express");
const app = express();
const helmet = require("helmet"); //helps secure apps by setting various HTTP headers

module.exports = function() {
  app.use(express.urlencoded({ extended: true })); //bodyParser
  app.use(express.static("public")); //used to serve static files in the public folder
  app.use(helmet());

  //ensure jwtPrivate key is set
  if (config.get("jwtPrivateKey").jwtPrivateKey) {
    console.log("reached");
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
