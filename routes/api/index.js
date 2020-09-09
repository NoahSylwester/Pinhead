const router = require("express").Router();
const projectRoutes = require("./projects");
const markerRoutes = require("./markers");
const userRoutes = require("./users");
const withAuth = require('../../middleware');

// routes
router.use("/projects", projectRoutes);
router.use("/markers", withAuth, markerRoutes);
router.use("/users", withAuth, userRoutes);

module.exports = router;
