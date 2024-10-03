/* eslint-disable linebreak-style */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let EmailNotiConfig = new mongoose.Schema({
    userId: { type:String, required: true},
    selectedDays: { type: Object, required: false },
    startTime: { type: String, required: false },
    endTime: { type: Date, required: false },
    timeZone: { type: String, required: false },
});

module.exports = mongoose.model("EmailNotiConfig", EmailNotiConfig, "EmailNotiConfig");
