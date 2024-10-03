const mongoose = require('mongoose');
const winston = require('winston');

module.exports = callback => {
  // Database connection
  // const connectionUrl = (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development')
  const connectionUrl = (process.env.NODE_ENV === 'test')
    ? process.env.MONGO_TEST_CONNECTION_URL
    : process.env.MONGO_AUTH_CONNECTION_URL;
  
  mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, err => {
    if (err) {
      // Log the error
      winston.error(err);
      callback(err);
    }
    else {
      // Log success
      winston.info("Mongo connected");
      callback();
    }
  })
}