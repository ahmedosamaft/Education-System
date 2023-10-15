const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const app = express();
const AppError = require('./utils/AppError');
const errorController = require('./controller/errorController');

const userRouter = require('./router/userRouter');
const courseRouter = require('./router/courseRouter');
const enrollRouter = require('./router/enrollRouter');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/enroll', enrollRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

module.exports = app;
