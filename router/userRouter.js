const router = require('express').Router();
const authController = require('../controller/auth.controllers/auth.controller');
const authValidation = require('../controller/auth.controllers/auth.validation');
const userController = require('../controller/user.controllers/user.controller');

router.post('/signup', authValidation.signup, authController.signup);
router.post('/login', authValidation.login, authController.login);

router
  .route('/all')
  .get(
    authController.protect,
    authController.restrictedTo('doctor', 'admin'),
    userController.getAllUsers
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictedTo('doctor', 'admin'),
    userController.getUser
  )
  .patch(
    authController.protect,
    authController.restrictedTo('admin'),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictedTo('admin'),
    userController.deleteUser
  );

router
  .route('/')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser);

module.exports = router;
