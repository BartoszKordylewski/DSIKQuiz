const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  nickname: String,
  date: {type: Date, default: Date.now()},
  correct: {type: Number, default: 0},
  questions: {type: Number, default: 0}
});

const record = mongoose.model('record', recordSchema, 'leaderboard');

module.exports = record;