const express = require("express");
const authMiddleware = require("../apis/helper");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} = require("../db/post/postService");

const router = express.Router();

// Get all posts
router.get("/", getPosts);

// Create a new post
router.post("/", authMiddleware, createPost);

// Update a post
router.put("/:id", authMiddleware, updatePost);

// Delete a post
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
