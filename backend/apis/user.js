const express = require("express");
const authMiddleware = require("../apis/helper");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserDescription,
} = require("../db/user/userService");

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get user profile (with posts)
router.get("/:id", getUserProfile);

// Update user description
router.put("/:id", authMiddleware, updateUserDescription);

module.exports = router;
