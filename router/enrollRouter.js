const router = require("express").Router();
const authController = require("../controller/auth.controllers/auth.controller");
const enrollController = require("../controller/enroll.controllers/enroll.controller");

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictedTo("student"),
    enrollController.findCourses
  )
  .post(authController.protect, enrollController.enroll)
  .delete(authController.protect, enrollController.unenroll);
router
  .route("/all")
  .get(
    authController.protect,
    authController.restrictedTo("doctor"),
    enrollController.findAllEnrollments
  );

router.route("/:sid").get(authController.protect, enrollController.findCourses);

module.exports = router;
