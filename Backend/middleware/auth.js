const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    // Bypass authentication for specific GET requests
    if (req.method === 'GET' && req.path.startsWith('/getQuiz/')) {
      return next(); // Bypass authentication
    }

    // Get token from either 'auth-token' header or 'Authorization' header
    let token = req.header("auth-token");

    // If 'auth-token' header is not present, check 'Authorization' header with 'Bearer' prefix
    if (!token) {
      const authHeader = req.header("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      }
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    if (!verified) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Find the user and attach to request
    const user = await User.findById(verified._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Attach the user object to the request
    next();
  } catch (err) {
    console.error("Error in authentication middleware:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = authMiddleware;
