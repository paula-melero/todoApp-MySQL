const winston = require("winston");
const config = require("config");
const Sequelize = require("sequelize");
const dbHost = process.env.MYSQL_HOST || config.get("dbHost");

const sequelize = new Sequelize(
  config.get("dbName"),
  config.get("dbUsername"),
  config.get("dbPassword"),
  {
    dialect: "mysql",
    host: dbHost,
    pool: {
      max: 10,
      min: 0
    },
    socketPath: config.get("socketPath")
  }
);

sequelize
  .authenticate()
  .then(() => {
    winston.info(`Successfully connected to database ${config.get("dbHost")}.`);
  })
  .catch(err => {
    winston.error("Unable to connect to the database:", err);
  });

// pool.query = util.promisify(pool.query);

//sync db according to existing models
sequelize.sync();

module.exports = sequelize;
