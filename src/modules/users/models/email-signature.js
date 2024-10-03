const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let emailSignatures = new mongoose.Schema({
  emailsignature:{type: String, required: false},
  userId: { type:String, required: true},
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('emailSignatures', emailSignatures);