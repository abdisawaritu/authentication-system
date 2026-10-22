require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(helmet());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

// Parse JSON requests BEFORE mounting routes.
app.use(express.json());

// Parse HTML form submissions if needed later.
app.use(express.urlencoded({ extended: true }));

// Health check.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication API is running.",
  });
});

 // Registration routes must come after the JSON parser.
app.use("/api/auth", authRoutes);

// Handle malformed JSON.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON. Check the request body syntax.",
    });
  }

  console.error("Express error:", err.message);

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
