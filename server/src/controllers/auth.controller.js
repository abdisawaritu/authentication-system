const pool = require("../config/db");
const bcrypt = require("bcryptjs");

// ==========================================
// REGISTER A NEW USER
// ==========================================
async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body || {};

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validate name
    if (cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must not exceed 100 characters.",
      });
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (cleanEmail.length > 255 || !emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // bcrypt supports passwords up to 72 bytes
    if (
      Buffer.byteLength(password, "utf8") < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 72 bytes.",
      });
    }

    // Check whether the email already exists
    const [existingUsers] = await pool.execute(
      "SELECT user_id FROM users WHERE email = ? LIMIT 1",
      [cleanEmail],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash the password before storing it
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert the new user into MySQL
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password_hash)
       VALUES (?, ?, ?)`,
      [cleanName, cleanEmail, passwordHash],
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: {
        user_id: result.insertId,
        name: cleanName,
        email: cleanEmail,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    // Also handle a duplicate-email conflict at database level
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected server error occurred.",
    });
  }
}

// ==========================================
// LOG IN AN EXISTING USER
// ==========================================
async function loginUser(req, res) {
  try {
    const { email, password } = req.body || {};

    // Validate the request body
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (Buffer.byteLength(password, "utf8") > 72) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find the registered user
    const [users] = await pool.execute(
      `SELECT user_id, name, email, password_hash
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [cleanEmail],
    );

    // Use the same response for an unknown email and wrong password
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = users[0];

    // Compare the submitted password with the stored bcrypt hash
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Create a fresh session after successful authentication
    req.session.regenerate((error) => {
      if (error) {
        console.error("Session regeneration error:", error.message);

        return res.status(500).json({
          success: false,
          message: "Could not create a login session.",
        });
      }

      // Store only the public user information in the session
      req.session.user = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
      };

      // Save the session before sending the success response
      req.session.save((saveError) => {
        if (saveError) {
          console.error("Session save error:", saveError.message);

          return res.status(500).json({
            success: false,
            message: "Could not save the login session.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Login successful.",
          user: req.session.user,
        });
      });
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An unexpected server error occurred.",
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
};
