const { autoIncrement } = require('mongoose-plugin-autoinc');
const mongoose = require('mongoose');
const validator = require('validator');

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: [true, 'Course code is required'],
      trim: true,
      validate: {
        validator: validator.isAlphanumeric,
        message: '{VALUE} is not a valid course code',
      },
    },
    description: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Course name is required'],
      validate: {
        validator: (value) => !/[^a-zA-Z 1-9]/.test(value),
        message: '{VALUE} is not a valid course name',
      },
      trim: true,
      unique: true,
    },
    doctor: {
      type: Number,
      ref: 'User',
      required: [true, 'Doctor is required'],
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

courseSchema.plugin(autoIncrement, {
  model: 'course',
  startAt: 1,
});


const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
