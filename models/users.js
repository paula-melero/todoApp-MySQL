require("dotenv").config();
const sequelize = require("../startup/db");
const Sequelize = require("sequelize");
const { Task } = require("../models/tasks");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const User = sequelize.define("user", {
  username: {
    type: Sequelize.String(30),
    primaryKey: true,
    allowNull: false,
    unique: true,
    validate: { min: 3 }
  },
  password: {
    type: Sequelize.STRING(999),
    allowNull: false,
    validate: { min: 6 }
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

//Define model relationships
User.hasMany(Task, {
  as: "createdBy",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

User.methods.generateAuthToken = function() {
  return (token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.jwtPrivateKey
  ));
};

//INPUT VALIDATION FUNCTION
function validateUser(user) {
  const schema = {
    username: Joi.string()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required(),
    repeat_password: Joi.ref("password")
  };

  return Joi.validate(user, schema);
}
exports.User = User;
exports.validateUser = validateUser;
exports.userSchema = userSchema;
