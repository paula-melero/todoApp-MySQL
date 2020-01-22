require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const router = express.Router();
const { User, validateUser, generateAuthToken } = require('../models/user');

//LOGIN A USER
router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error)
    return res.status(400).json({
      statusCode: 400,
      errorCode: error.name,
      message: error.details[0].message
    });

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username: username } });

    if (!user)
      return res.status(400).json({ message: 'Invalid username or password' });

    //password check
    const validPwd = await bcrypt.compare(password, user.password);

    if (!validPwd)
      return res.status(400).json({ message: 'Invalid username or password' });

    //generate JWT
    const token = generateAuthToken(user.id, user.isAdmin);

    //return token in HTTP header
    res.header('x-auth-token', token);
    res.status(200).send({
      statusCode: 200,
      body: _.pick(user, ['id', 'username']),
      message: 'Successful login!'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
