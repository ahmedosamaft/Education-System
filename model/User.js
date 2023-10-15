const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { autoIncrement } = require('mongoose-plugin-autoinc');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'doctor', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'student',
    },
    avatar: {
      type: String,
      default: '/images/avatar.png',
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password, (ret.id = ret._id), delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        (ret.id = ret._id), delete ret._id;
        return ret;
      },
    },
  }
);

userSchema.plugin(autoIncrement, {
  model: 'user',
  startAt: 1,
});


userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.changedPasswordAfter = function (issuedAt) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimestamp > issuedAt;
  }
  return false;
};

userSchema.pre(/^save/, async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
