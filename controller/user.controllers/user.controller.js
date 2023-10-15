const User = require('../../model/User');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

const { filterObj } = require('./user.validation');

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({}, '-createdAt');
  res.status(200).json({
    status: 'success',
    data: { users: users },
  });
});

module.exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id || req.user._id;
  if (!id) return next(new AppError('ID is required', 400));
  let user = await User.findById({ _id: +id }, { passwordChangedAt: 0 });
  if (!user) return next(new AppError('User not found', 404));
  // let data = filterObj(user, true, 'name', '_id', 'email');
  res.status(200).json({
    status: 'success',
    data: { user: user },
  });
});

module.exports.updateUser = catchAsync(async (req, res, next) => {
  const id = req.params.id || req.user._id;
  if (!id) return next(new AppError('ID is required', 400));
  if (req.body.password) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  let user = await User.findByIdAndUpdate(
    id,
    filterObj(req.body, false, 'name', 'email'),
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(202).json({
    status: 'success',
    data: { user },
  });
});

module.exports.deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id || req.user._id;
  if (!id) return next(new AppError('ID is required', 400));
  let user = await User.findByIdAndDelete(id);
  if (!user) return next(new AppError('User not found', 404));
  res.status(204).json({
    status: 'success',
    data: null,
  });
});


