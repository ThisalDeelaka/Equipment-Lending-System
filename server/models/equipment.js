const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ['Good', 'Fair', 'Poor'],
    default: 'Good',
  },
  status: {
    type: String,
    enum: ['Available', 'Unavailable', 'Under Maintenance'],
    default: 'Available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
