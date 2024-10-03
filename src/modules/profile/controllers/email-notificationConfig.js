const axios = require("axios");
const EmailNotiConfig = require("../models/email-notoficationConfigModel");

const EmailNotificationConfigrationcontroller = {
  addEmailnotificationConfig: (req, callback) => {
    const data = req.body.data;

    EmailNotiConfig.findOne({ userId: data.userId }, (err, doc) => {
      if (doc == null || doc == "" || doc == undefined) {
        EmailNotiConfig.create(data, function (err, docs) {
          if (err || !docs) {
            callback(err);
          } else {
            callback(null, docs);
          }
        });
      } else {
        const filter = { userId: data.userId };
        const update = data;
        EmailNotiConfig.findOneAndUpdate(filter, update, function (err, docs) {
          if (err) {
            callback(err);
          } else {
            callback(null, docs);
          }
        });
      }
    });
  },

  getEmailnotificationConfig: (req, callback) => {
    const userid = req.params.id;
    EmailNotiConfig.findOne({ userId: userid }, (err, doc) => {
      if (err) {
        callback(err);
      } else {
        callback(null, doc);
      }
    });
  },
};
module.exports = EmailNotificationConfigrationcontroller;
