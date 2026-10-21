const pool = require("../config/db");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  try {
    // 1. Check that the request body is an object.
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing or invalid. Send the data as JSON.",
      });
    }

    // 2. Read the submitted data.
    const { name, email, password } = req.body;

    // 3. Validate required fields and their types.
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

    // 4. Normalize the name and email.
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // 5. Validate name length.
    if (cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must not exceed 100 characters.",
      });
    }

    // 6. Validate email format.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (cleanEmail.length > 255 || !emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // 7. Validate password length.
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 72 characters.",
      });
    }

    // 8. Check whether this email is already registered.
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

    // 9. Hash the password before saving it.
    const passwordHash = await bcrypt.hash(password, 12);

    // 10. Insert the new user into MySQL.
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password_hash)
       VALUES (?, ?, ?)`,
      [cleanName, cleanEmail, passwordHash],
    );

    // 11. Return the new user's public information.
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
    // Handle duplicate email errors, including concurrent requests.
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Keep technical details in the backend terminal.
    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during registration.",
    });
  }
}

module.exports = { registerUser };
