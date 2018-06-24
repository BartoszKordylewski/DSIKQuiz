const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  date: {type: Date, default: Date.now()},
  message: {type: String},
  question: {type: Number}
});

const report = mongoose.model('report', reportSchema, 'reports');

module.exports = report;