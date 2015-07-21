var express = require('express');
var session = require('express-session');
var path = require('path');
var config = require('./config')();
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var cors = require('cors');

////////////////////////////////////////////////////////////////////////////////
/// Libraries and database driver
////////////////////////////////////////////////////////////////////////////////

var fs = require("fs");
var Promise = require("promise");
var concat = require("concat-stream");

var server_addr = process.env.ARANGODB_SERVER ? process.env.ARANGODB_SERVER : "http://localhost:8529";
var ignore = console.log("Using DB-Server " + server_addr);

var Database = require("arangojs");
if (server_addr !== "none") {
  var db = new Database(server_addr);          // configure server
}

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieParser())
app.use(session({secret:'yoursecret', cookie:{maxAge:6000}}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/static"));

/* init collections */
require('./injectSeedData');

global.sess;

////////////////////////////////////////////////////////////////////////////////
/// Controllerss
////////////////////////////////////////////////////////////////////////////////

var activities = require('./controllers/activities')({app: app, db: db});
var groups = require('./controllers/groups')({app: app, db: db});
var users = require('./controllers/users')({app: app, db: db});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
