const router = require('express').Router();
const courseController = require('../controller/courseController');
const authController = require('../controller/auth.controllers/auth.controller');

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictedTo('doctor','admin'),
    courseController.createCourse
  );

router
  .route('/all')
  .get(authController.protect, courseController.getAllCourses);

module.exports = router;
