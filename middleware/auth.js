require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  try {
    //jwt.verify() returns the decoded jwt payload
    const payload = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = payload;
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
};
