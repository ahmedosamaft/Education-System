const { body } = require('express-validator');

const login = [
  body('name').isEmpty().withMessage('Please enter a name'),
  body('email')
    .notEmpty()
    .withMessage('Please enter your email')
    .isEmail()
    .withMessage(' is not valid email'),
  body('password')
    .notEmpty()
    .withMessage(`Please enter your password`)
    .isLength({ min: 8 })
    .withMessage(` is not correct`),
];

const signup = [
  body('email')
    .notEmpty()
    .withMessage('Please enter your email')
    .isEmail()
    .withMessage(' is not valid email'),
  body('password')
    .notEmpty()
    .withMessage('Please enter your password')
    .isLength({ min: 8 })
    .withMessage(` must be at least 8 characters`),
];

module.exports = {
  signup,
  login,
};
