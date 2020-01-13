require("dotenv").config();
const mongoose = require("mongoose");
const { taskSchema } = require("../models/tasks");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    alphanum: true,
    minlength: 3,
    maxlength: 30,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 999
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  return (token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.jwtPrivateKey
  ));
};
const User = mongoose.model("User", userSchema);

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
