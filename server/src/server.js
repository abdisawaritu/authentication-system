require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");
const { sessionMiddleware } = require("./config/session");

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Security headers
app.use(helmet());

// Allow the React frontend to make credentialed requests
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize the session before handling routes
app.use(sessionMiddleware);

// Health-check endpoint
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authentication API is running.",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Handle malformed JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON. Check the request body.",
    });
  }

  console.error("Express error:", err.message);

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
