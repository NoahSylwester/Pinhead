const router = require("express").Router();
const markersController = require("../../controllers/markersController");

// Matches with "/api/markers"
router.route("/")
  .get(markersController.findAll)
  .marker(markersController.create);

// Matches with "/api/markers/:id"
router
  .route("/:id")
  .get(markersController.findById)
  .marker(markersController.createReply)
  .put(markersController.update)

module.exports = router;