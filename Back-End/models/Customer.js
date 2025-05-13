// Back-End/models/Customer.js
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', CustomerSchema);
