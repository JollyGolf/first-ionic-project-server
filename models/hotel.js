const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  name: String,
  description: String
});

module.exports = mongoose.model('Hotel', hotelSchema);