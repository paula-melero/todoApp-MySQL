const winston = require("winston");
const config = require("config");
const mysql = require("mysql");
const util = require("util");

module.exports = async function() {
  const { db } = config.get("db");
  const pool = mysql.createPool({
    connectionLimit: 10,
    host,
    username,
    password
  });
  pool.getConnection((err, connection) => {
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
      return;
    }
  });
  pool.query = util.promisify(pool.query);
  try {
    const result = await pool.query("CREATE DATABASE IF NOT EXISTS todo-app");
    const table1 = await pool.query(
      "CREATE TABLE IF NOT EXISTS users (username varchar(30) NOT NULL, password varchar(999) NOT NULL, PRIMARY KEY(id));"
    );
    const table2 = await pool.query(
      "CREATE TABLE IF NOT EXISTS tasks ( CREATE TABLE IF NOT EXISTS tasks (id int(11) NOT NULL auto_increment, title varchar(30) NOT NULL, description varchar(255), date: int(12), status varchar(6), createdBy varchar(30))"
    );

    console.log(result);
  } catch (err) {
    winston.error(err.message);
  }
};
