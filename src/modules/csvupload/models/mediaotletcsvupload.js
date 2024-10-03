const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let mediaotletcsvupload = new Schema({
  companyName: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  position: { type: String, required: false },
  phone: { type: String, required: false },
  email: { type: String, required: false },
  mediaType: { type: String, required: false },
  dataFileType: { type: Number, required: false },
  sourceFileType: { type: Number, required: false },
  year: { type: Number, required: false },
  inputFile: { type: String, required: false },
});

module.exports = mongoose.model('mediaotletcsvupload', mediaotletcsvupload);