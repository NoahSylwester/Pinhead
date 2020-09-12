const router = require("express").Router();
const markersController = require("../../controllers/markersController");

// Matches with "/api/markers"
router.route("/")
  .get(markersController.findAll)
  .post(markersController.create);

// Matches with "/api/markers/:id"
router
  .route("/:id")
  .get(markersController.findById)
  .put(markersController.update)
  .delete(markersController.remove)

module.exports = router;