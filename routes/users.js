const express = require("express");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const router = express.Router();
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const admin = require("../middleware/admin");
const { User, validateUser } = require("../models/user");

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
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);

    if (error) return res.status(400).json(error.details[0].message);

    const { username, password, repeat_password } = req.body;

    let user = await User.findOne({ where: username });

    //check if username exists
    if (user)
      return res.status(400).json({ message: "Username already exists" });

    //check if passwords match
    if (password !== repeat_password)
      res.status(400).json({ message: "Passwords don't match" });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //create document and save
    user = new User({ username, password: hash });
    await User.create({ username, password: hash });

    //generate JWT
    const token = user.generateAuthToken();

    //return token in HTTP header
    res.header("x-auth-token", token);
    res.status(200).json(_.pick(user, ["_id", "username"]));
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
