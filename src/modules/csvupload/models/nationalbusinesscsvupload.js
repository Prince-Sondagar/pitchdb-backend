const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let nationalbusinesscsvupload = new Schema({
  firstName: { type: String, required: false },
  middleName: { type: String, required: false },
  lastName: { type: String, required: false },
  organization: { type: String, required: false },
  acronym: { type: String, required: false },
  position: { type: String, required: false },
  role: { type: String, required: false },
  phoneExt: { type: Number, required: false },
  phone: { type: String, required: false },
  faxExt: { type: String, required: false },
  fax: { type: String, required: false },
  address1: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  country: { type: String, required: false },
  phone1: { type: String, required: false },
  orgFax: { type: String, required: false },
  website: { type: String, required: false },
  email: { type: String, required: false },
  dataFileType: { type: Number, required: false },
  sourceFileType: { type: Number, required: false },
  year: { type: Number, required: false },
  inputFile: { type: String, required: false },
  stockTicker: { type: String, required: false },
  revenue: { type: Number, required: false },
  address2: { type: String, required: false },

});

module.exports = mongoose.model('nationalbusinesscsvupload', nationalbusinesscsvupload);