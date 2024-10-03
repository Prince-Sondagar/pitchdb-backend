const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let associationcsvupload = new Schema({
schoolName: { type: String, required: false },
principalName: { type: String, required: false },
firstName: { type: String, required: false },
lastName: { type: String, required: false },
address: { type: String, required: false },
city: { type: String, required: false },
state: { type: String, required: false },
zipCode: { type: Number, required: false },
phone: { type: String, required: false },
fax: { type: String, required: false },
district: { type: String, required: false },
zipCodePlus4: { type: String, required: false },
county: { type: String, required: false },
elementarySchool: { type: String, required: false },
middleSchool: { type: String, required: false },
juniorHighSchool: { type: String, required: false },
highSchool: { type: String, required: false },
title1: { type: String, required: false },
ncesIdNumber: { type: Number, required: false },
dataFileType: { type: Number, required: false },
sourceFileType: { type: Number, required: false },
year: { type: Number, required: false },
email: { type: String, required: false },
entryType: { type: String, required: false }
});

module.exports = mongoose.model('associationcsvupload', associationcsvupload);