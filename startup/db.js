const winston = require("winston");
const config = require("config");
const mysql = require("mysql");

module.exports = function() {
  const { db } = config.get("db");
  const connPool = mysql.createPool({
    connectionLimit: 10,
    host,
    username,
    password
  });
  connPool.getConnection((err, connection) => {
    if (err) {
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        winston.error("Database connection was closed.");
      }
      if (err.code === "ER_CON_COUNT_ERROR") {
        winston.error("Database has too many connections.");
      }
      if (err.code === "ECONNREFUSED") {
        winston.error("Database connection was refused.");
      }
    }

    if (connection) {
      connection.release();
      winston.info(`Connected to ${host}`);
      connection.query("CREATE DATABASE todo-app", (err, result) => {});

      return;
    }
  });
};
