const router = require("express").Router();
const snippetRoutes = require("./snippets");
const postRoutes = require("./posts");
const userRoutes = require("./users");
const threadRoutes = require("./threads");
const eventRoutes = require("./events");
const topicRoutes = require("./topics");
const withAuth = require('../../middleware');

// routes
router.use("/snippets", snippetRoutes);
router.use("/posts", withAuth, postRoutes);
router.use("/users", withAuth, userRoutes);
router.use("/threads", withAuth, threadRoutes);
router.use("/events", withAuth, eventRoutes);
router.use("/topics", withAuth, topicRoutes);

module.exports = router;
