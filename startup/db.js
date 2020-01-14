const winston = require("winston");
const config = require("config");
const mysql = require("mysql");
const Sequelize = require("sequelize");
const util = require("util");

module.exports = async function() {
  // const { name, host, username, password } = config.get("db");
  const sequelize = new Sequelize("oLbnEAC5tr", "oLbnEAC5tr", "AvK1rxQl7T", {
    dialect: "mysql",
    host: "remotemysql.com",
    pool: {
      max: 10,
      min: 0
    }
  });

  sequelize
    .authenticate()
    .then(() => {
      winston.info("Connection has been established successfully.");
    })
    .catch(err => {
      winston.error("Unable to connect to the database:", err);
    });

  // pool.query = util.promisify(pool.query);

  //sync db according to existing models
  sequelize.sync();
  return sequelize;
};
