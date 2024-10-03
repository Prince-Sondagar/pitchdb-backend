/* eslint-disable linebreak-style */
require('dotenv').config()
require('../logging-config')();

const path = require('path');
const express = require('express');
const app = express();
const async = require('async');
const winston = require('winston');

// Entry point of the app

// Perform all necessary initialization and emit an event when ready
async.parallel([
  callback => {
    // Connect to the mongo database
    require('./config/database')(callback);
  },
  callback => {
    // General express configuraton
    app.use(express.static(path.join(__dirname, 'public')));
    require('./config/initial')(app, callback);
  },
  callback => {
    // Configure express to use the app's routes
    require('./routes')(app, callback);
  },
  callback => {
    // Initialize de server and assign sockets
    let server = require('./config/server')(app);
    require('./sockets')(server, callback);
  }
], (err) => {
  if (err) {
    winston.error('Could not initialize app');
    app.emit("app_error");
  }
  else {
    winston.info("App initialized");
    app.set('status', 'started');
    // Require the express error handler last
    app.use(require('./modules/common/errors/error-handlers').handleError);
    app.emit("app_started");
  }
})


module.exports = app;

process.on('uncaughtException', (error, origin) => {
  console.log('----- Uncaught exception -----')
  console.log(error)
  console.log('----- Exception origin -----')
  console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('----- Unhandled Rejection at -----')
  console.log(promise)
  console.log('----- Reason -----')
  console.log(reason)
})