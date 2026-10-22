const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Register a new user
router.post("/register", registerUser);

// Log in an existing user
router.post("/login", loginUser);

// ==========================================
// PROTECTED ROUTES
// ==========================================

// Get the currently authenticated user
router.get("/me", requireAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.session.user,
  });
});

// Log out the authenticated user and destroy their session
router.post("/logout", requireAuth, logoutUser);

module.exports = router;
