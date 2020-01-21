const Sequelize = require('sequelize');
const sequelize = require('../startup/db');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      min: 3,
      max: 30
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { min: 6 }
  }
});
const generateAuthToken = (id, isAdmin) => {
  return (token = jwt.sign(
    { id: id, isAdmin: isAdmin },
    config.get('jwtPrivateKey')
  ));
};
exports.User = User;
exports.generateAuthToken = generateAuthToken;
