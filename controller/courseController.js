const Course = require('../model/Course');
const catchAsync = require('../utils/catchAsync');

module.exports.createCourse = catchAsync(async (req, res, next) => {
  const { code, description, name, students } = req.body;
  const doctor = req.user.id;
  const course = new Course({
    code,
    description,
    name,
    doctor,
    students,
  });
  await course.save();
  res.status(201).json({ status: 'success', data: { course } });
});

module.exports.getAllCourses = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: { courses: await Course.find().populate('doctor', '+name') },
  });
});
