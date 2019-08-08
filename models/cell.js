const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cellSchema = new Schema({
  number: Number,
  name: String,
  idHotel: String,
  cost: Number,
  available: String
});

module.exports = mongoose.model('Cell', cellSchema);