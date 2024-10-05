const Reservation = require('../models/bookings');
const Equipment = require('../models/equipment');

exports.getDashboardData = async (req, res) => {
  try {
   
    const totalReservations = await Reservation.countDocuments();

   
    const totalEquipment = await Equipment.countDocuments();

   
    const recentCheckInOut = await Reservation.find({
      $or: [{ checkIn: { $ne: null } }, { checkOut: { $ne: null } }],
    })
      .sort({ updatedAt: -1 })
      .limit(5);

    res.status(200).json({
      totalReservations,
      totalEquipment,
      recentCheckInOut,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data', error });
  }
};
