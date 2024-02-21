const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const audioSchema = new Schema({
    filename: String,
    path: String,
    transcript: String,
    date: {type: Date, default: Date.now}
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;