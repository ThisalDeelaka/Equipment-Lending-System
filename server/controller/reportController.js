const Reservation = require('../models/bookings');
const Equipment = require('../models/equipment');


exports.getEquipmentUsageReport = async (req, res) => {
  try {
    const report = await Reservation.aggregate([
      {
        $group: {
          _id: '$equipmentId',
          totalReservations: { $sum: 1 },
          lastReservationDate: { $max: '$reservationDate' },
        },
      },
      {
        $lookup: {
          from: 'equipment', 
          localField: '_id',
          foreignField: '_id',
          as: 'equipmentDetails',
        },
      },
      {
        $unwind: '$equipmentDetails',
      },
      {
        $project: {
          equipmentName: '$equipmentDetails.name',
          totalReservations: 1,
          lastReservationDate: 1,
        },
      },
    ]);

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report', error });
  }
};
