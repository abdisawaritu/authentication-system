const express = require("express");

const { registerUser, loginUser } = require("../controllers/auth.controller");

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Log in an existing user
router.post("/login", loginUser);

// Check whether the request has an authenticated session
router.get("/me", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: "You are not authenticated.",
    });
  }

  return res.status(200).json({
    success: true,
    user: req.session.user,
  });
});

module.exports = router;
