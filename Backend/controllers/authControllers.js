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
  
  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Wrong Email or Password" });
  }
  
  // Validate the password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Wrong Email or Password" });
  } 
  
  // Generate the JWT token
  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
  
  // Send the token in the response body and as an auth-token header
  res.header('auth-token', token).json({ 
    message: "Logged in successfully", 
    token: token  // Include the token here as well
  });
};


// // generate tokens
// const generateToken = (user) => {
//   const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
//     expiresIn: "1h",
//   });
//   return token;
// };

// const registerUser = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//     });

//     if (user) {
//       res.status(201).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         token: generateToken(user)
//       });
//     } else {
//       res.status(400).json({ message: "Invalid user data" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//       const user = await User.findOne({ email });

//       if (user && (await user.matchPassword(password))) {
//         res.json({
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           token: generateToken(user)
//         });
//       } else {
//         res.status(400).json({ message: 'Invalid email or password' });
//       }
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };

// export
module.exports = { registerUser, loginUser };
