const router = require("express").Router();
const projectsController = require("../../controllers/projectsController");
const multer = require('multer');
// set up multer oath
const upload = multer({dest: __dirname + '../../../uploads/temp'});
const withAuth = require('../../middleware');

// Matches with "/api/projects"
router.route("/")
  .get(withAuth, projectsController.findAll)
  .post(withAuth, projectsController.create)

// Matches with "/api/projects/search"
router.route("/search")
  .post(withAuth, projectsController.searchAll)


// Matches with "/api/projects/:id"
router
  .route("/:id")
  .get(withAuth, projectsController.findById)
  .put(withAuth, projectsController.update)
  .delete(withAuth, projectsController.remove);

// Matches with "/api/projects/image/:id"
router
  .route("/image/:id")
  .get(projectsController.serveBinaryImage)
  .put(withAuth, upload.single('file'), projectsController.updateImage)

module.exports = router;
