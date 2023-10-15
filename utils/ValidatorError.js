const { validationResult } = require('express-validator');
const AppError = require('./AppError');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((err) => {
        let msg = `${err.path}: ${err.value ? err.value : ''}${err.msg}`;
        err.message = msg;
        return msg;
      })
      .join('. ');
    const error = new AppError(messages, 400);
    error.name = 'ValidationError';
    error.errors = errors.array();
    return next(error);
  }
};
