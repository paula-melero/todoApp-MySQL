const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const router = express.Router();
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const admin = require('../middleware/admin');
const { User, generateAuthToken, validateUser } = require('../models/user.js');

//GET ALL USERS
// router.get(
//   "/",
//   [auth, admin],
//   asyncMiddleware(async (req, res) => {
//     const users = await User.find()
//       .sort({ username: 1 })
//       .select("-password")
//       .skip((req.query.pageNumber - 1) * req.query.pageSize)
//       .limit(parseInt(req.query.pageSize));

//     res.status(200).json(users);
//   })
// );

// //GET CURRENTLY LOGGED IN USER
// router.get(
//   "/me",
//   auth,
//   asyncMiddleware(async (req, res) => {
//     console.log("reached get one user");
//     const user = await User.findById({ _id: req.user._id }).select("-password");

//     if (!user)
//       return res
//         .status(404)
//         .json({ message: "User with the given ID was not found" });

//     res.status(200).json(user);
//   })
// );

//REGISTER A USER
router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);

    if (error)
      return res.status(400).json({
        statusCode: 400,
        errorCode: error.details[0].path + error.name,
        message: error.details[0].message
      });

    const { username, password } = req.body;

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //create document and save
    const result = await User.create({ username, password: hash });

    //generate JWT
    const token = generateAuthToken(result.dataValues.id, false);

    //return token in HTTP header
    res.header('x-auth-token', token);
    res.status(201).json(_.pick(result, ['id', 'username']));
    //could return this { message: 'User registered successfully!' }
  })
);

// //UPDATE USER
// router.put(
//   "/:id",
//   auth,
//   asyncMiddleware(async (req, res) => {
//     const { error } = validateUser(req.body);

//     if (error) return res.status(400).json(error.details[0].message);

//     //check auth rights
//     if (req.user._id !== req.params.id)
//       return res
//         .status(401)
//         .json({ message: "Access denied. Cannot edit user with given ID." });

//     const { username, password } = req.body;

//     //hash password
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         $set: { username, password: hash }
//       },
//       { new: true }
//     );

//     if (!user)
//       return res
//         .status(404)
//         .json({ message: "User with the given ID was not found" });

//     res.status(200).json(user);
//   })
// );

// //DELETE USER
// router.delete(
//   "/:id",
//   [auth, admin],
//   asyncMiddleware(async (req, res) => {
//     const result = await User.findByIdAndDelete(req.params.id);

//     if (!result)
//       return res
//         .status(404)
//         .json({ message: "User with the given ID was not found" });

//     res.status(200).json(result);
//   })
// );

module.exports = router;
