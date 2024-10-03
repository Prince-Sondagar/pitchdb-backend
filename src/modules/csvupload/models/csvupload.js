const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let csvupload = new Schema({
  category: { type: String, required: false },
  eventName: { type: String, required: false },
  location: { type: String, required: false },
  city: { type: String, required: false },
  country: { type: String, required: false },
  dateOld: { type: String, required: false },
  date: { type: String, required: false },
  website: { type: String, required: false },
  email: { type: String, required: false },
  eventDescription: { type: String, required: false },
  dataFileType: { type: Number, required: false },
  sourceFileType: { type: Number, required: false },
  year: { type: Number, required: false },
  inputFile: { type: String, required: false },
  estAudience: { type: Number, required: false },
  state: { type: String, required: false },
  contactName: { type: String, required: false },
});

module.exports = mongoose.model('csvupload', csvupload);