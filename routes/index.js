const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
const authRoutes = require("./auth");
const adminRoutes = require("./admin");
const withAuth = require('../middleware');

// API Routes
router.use("/admin", adminRoutes)
router.use("/api", apiRoutes);
router.use("/auth", authRoutes);

// If no API routes are hit, send the React app
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
  // res.sendFile(path.join(__dirname, "../login.html"));
});

module.exports = router;
