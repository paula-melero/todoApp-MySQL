const Sequelize = require('sequelize');
const sequelize = require('../startup/db');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');

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

const validateUser = user => {
  const schema = {
    username: Joi.string()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required(),
    repeat_password: Joi.ref('password')
  };

  return Joi.validate(user, schema);
};

const generateAuthToken = (id, isAdmin) => {
  return (token = jwt.sign(
    { id: id, isAdmin: isAdmin },
    config.get('jwtPrivateKey')
  ));
};
exports.User = User;
exports.validateUser = validateUser;
exports.generateAuthToken = generateAuthToken;
