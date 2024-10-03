const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let localbusinesscsvupload = new Schema({
  companyName : { type: String, required: false },
  email : { type: String, required: false },
  address : { type: String, required: false },
  city : { type: String, required: false },
  state : { type: String, required: false },
  sicCode : { type: Number, required: false },
  webAddress : { type: String, required: false },
  dataFileType : { type: Number, required: false },
  sourceFileType : { type: Number, required: false },
  year : { type: String, Number: false },
  inputFile : { type: String, required: false },
  description : { type: String, required: false }


});

module.exports = mongoose.model('localbusinesscsvupload', localbusinesscsvupload);