/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Userimage = new mongoose.Schema({
userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  userimage:   { type: String, required: false },

});

module.exports = mongoose.model('Userimage', Userimage, 'Userimage');