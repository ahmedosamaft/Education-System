const mongoose = require('mongoose');
const validator = require('validator');

const sectionScheme = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Section code is required'],
    validate: {
      validator: validator.isAlphanumeric,
      message: '{VALUE} is not a valid section code',
    },
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor is required'],
    refPath: 'id',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required'],
  },
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
      refPath: 'id',
    },
  ],
});

const Section = mongoose.model('Section', sectionScheme);

module.exports = Section;

