const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true,
  },
  equipmentName: { // Add the equipmentName field
    type: String,
    required: true, // Make this required since it's needed for each reservation
  },
  reservationDate: {
    type: Date,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  specialRequests: {
    type: String,
  },
});

module.exports = mongoose.model('Reservation', ReservationSchema);
