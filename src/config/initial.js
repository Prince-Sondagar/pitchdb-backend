const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const winston = require('winston')
const morgan = require('morgan')

module.exports = (app, callback) => {
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
  app.use(bodyParser.urlencoded({ extended: false }));
  // app.use(cookieParser());
  if (process.env.NODE_ENV !== 'production')
    app.use(cors());
  app.set('authSecret', process.env.AUTHORITY_SPARK_SECRET);

  // Log requests
  app.use(morgan("tiny", { stream: { write: message => winston.info(message.trim()) } }));

  callback();
}