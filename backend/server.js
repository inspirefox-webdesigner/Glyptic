const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling middleware for JSON parsing
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    console.error("JSON Parse Error:", error.message);
    return res.status(400).json({ message: "Invalid JSON format" });
  }
  next();
});

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/glyptic", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("\n ================================");
    console.log(" MongoDB Connected Successfully!");
    console.log(" Database: glyptic");
    console.log(" Connection: mongodb://localhost:27017/glyptic");
    console.log(" ================================\n");
  })
  .catch((err) => {
    console.error("\n ================================");
    console.error(" MongoDB Connection Error:", err.message);
    console.error(" ================================\n");
  });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/services", require("./routes/services"));
app.use("/api/solutions", require("./routes/solutions"));
app.use("/api/products", require("./routes/products"));
app.use("/api/blogs", require("./routes/blogs"));
app.use("/api/gallery", require("./routes/gallery"));
app.use("/api/careers", require("./routes/careers"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/faqs", require("./routes/faqs"));
app.use("/api/training", require("./routes/training"));
app.use("/api/admin-settings", require("./routes/adminSettings"));
app.use("/api/hero-slider", require("./routes/heroSlider"));
app.use("/api", require("./routes/upload"));
app.use("/api/notifications", require("./routes/notification"));

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});


app.use((error, req, res, next) => {
  console.error("Global Error Handler:", error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

app.listen(PORT, () => {
  console.log("\n ================================");
  console.log(` Server running on port ${PORT}`);
  console.log(` Admin Panel: http://localhost:5173`);
  console.log(` API Base: http://localhost:${PORT}/api`);
  console.log(" ================================\n");
});
