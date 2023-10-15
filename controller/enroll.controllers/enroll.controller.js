const Course = require("../../model/Course");
const Student = require("../../model/User");
const Enrollment = require("../../model/Enrollment");

const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

module.exports.enroll = catchAsync(async (req, res, next) => {
  const id = req.body.id || req.user._id;
  if (id == req.user._id && req.user.role == "doctor")
    return next(new AppError("Student Id is Required", 400));
  if (id !== req.user._id && req.user.role == "student")
    return next(new AppError("You are not allowed to do this", 403));
  const { code, semester } = req.body;
  if (!code || !semester)
    return next(new AppError("Course Code and Semester is required", 400));
  const course = await Course.findOne({ code });
  const student = await Student.findById(+id);
  if (!course) return next(new AppError("Course not found", 404));
  if (!student) return next(new AppError("Student not found", 404));
  const enrollment = Enrollment({
    course: course._id,
    student: +id,
    semester,
  });
  await enrollment.save();
  res.status(201).json({ status: "success", data: { enrollment } });
});

module.exports.unenroll = catchAsync(async (req, res, next) => {
  const id = req.body.id || req.user._id;
  if (id == req.user._id && req.user.role == "doctor")
    return next(new AppError("Student Id is Required", 400));
  if (id !== req.user._id && req.user.role == "student")
    return next(new AppError("You are not allowed to do this", 403));
  const { code, semester } = req.body;
  if (!code || !semester)
    return next(new AppError("Course Code and Semester is required", 400));
  const course = await Course.findOne({ code });
  const student = await Student.findById(+id);
  console.log(course);
  console.log(code);
  if (!course) return next(new AppError("Course not found", 404));
  if (!student) return next(new AppError("Student not found", 404));
  const enrollment = await Enrollment.findOneAndDelete({ course: course._id });

  res.status(204).json({ status: "success", data: null });
});

module.exports.findCourses = catchAsync(async (req, res, next) => {
  const sid = req.params.sid || req.user._id;
  if (!sid) return next(new AppError("Student Id is required", 400));
  if (req.user.role != "doctor" && sid != req.user.id)
    return next(new AppError("You do not have permission to do this"), 403);
  const enrollments = await Enrollment.find(
    { student: +sid },
    { student: 0 }
  ).populate("course", { code: 1 });

  res.status(200).json({
    status: "success",
    data: { enrollments },
  });
});

module.exports.findAllEnrollments = catchAsync(async (req, res, next) => {
  const enrollments = await Enrollment.find()
    .populate("course", { code: 1 })
    .populate("student", { email: 1 });
  res.status(200).json({
    status: "success",
    data: { enrollments },
  });
});
