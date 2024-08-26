const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  res.status(200).json({ message: "User Registered Successfully" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Wrong Email or Password" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Wrong Email or Password" });
  }

  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

  res.header("auth-token", token).json({
    message: "Logged in successfully",
    token: token,
  });
};

module.exports = { registerUser, loginUser };
