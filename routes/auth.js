require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const Joi = require("joi");
const router = express.Router();
const { User } = require("../models/users");

function validate(req) {
  const schema = {
    username: Joi.string()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required()
  };

  return Joi.validate(req, schema);
}

//LOGIN A USER
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });

    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    //password check
    const validPwd = await bcrypt.compare(password, user.password);

    if (!validPwd)
      return res.status(400).json({ message: "Invalid username or password" });

    //generate JWT
    const token = user.generateAuthToken();

    //return token in HTTP header
    res.header("x-auth-token", token);
    res.send(_.pick(user, ["_id", "username"]));
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
