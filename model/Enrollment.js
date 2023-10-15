const mongoose = require('mongoose');
const { autoIncrement } = require('mongoose-plugin-autoinc');

const enrollmentSchema = new mongoose.Schema(
  {
    course: {
      type: Number,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    student: {
      type: Number,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
      validate: {
        validator: (value) =>
          /(FALL|SPRING|SUMMER)/gi.test(value) && parseInt(value.split(' ')[1]),
        message: '{VALUE} is not a valid semester',
      },
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform: function (doc, ret) {
        (ret.id = ret._id), delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

enrollmentSchema.plugin(autoIncrement, {
  model: 'enrollmentSchema',
  startAt: 1,
});



const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
