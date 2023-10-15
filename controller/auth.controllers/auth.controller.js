const jwt = require('jsonwebtoken');
const User = require('../../model/User');
const catchAsync = require('../../utils/catchAsync');

const AppError = require('../../utils/AppError');
const validateInput = require('../../utils/ValidatorError');
const { promisify } = require('util');

const signToken = (payload, opt) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, opt);

const verifyToken = (token) =>
  promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

module.exports.signup = catchAsync(async (req, res, next) => {
  validateInput(req, res,next);
  const { email, password, name } = req.body;
  const user = new User({ name, email, password });
  await user.save();
  const token = signToken(
    { email, id: user._id, role: 'student' },
    { expiresIn: '30d' }
  );
  res.status(201).json({ status: 'success', data: { token } });
});

module.exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide email and password!', 400));
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkPassword(password)))
    return next(new AppError('Incorrect email or password', 401));
  const token = signToken({ email, id: user._id, role: user.role });
  res.status(200).json({ status: 'success', data: { token } });
});

module.exports.protect = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token && req.headers.authorization?.split(' ')[0] !== 'Bearer')
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  const decoded = await verifyToken(token);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  req.user = currentUser;
  next();
});

module.exports.restrictedTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(req.user);
      next(new AppError('You are not allowed to this', 403));
    } else next();
  };
