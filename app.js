var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var constDB = require('./db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var profileRouter = require('./routes/profile');
var apiRouter = require('./routes/api');
var servicesRouter = require("./routes/services")
var { auth_view, auth_admin} = require('./auth/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);
app.use('/', auth_view, indexRouter);
app.use('/profile', auth_view, profileRouter);
app.use('/admin', auth_view, adminRouter);
app.use('/users', auth_view, usersRouter);
app.use('/services', auth_view, servicesRouter);
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 })
  res.redirect("/")
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
