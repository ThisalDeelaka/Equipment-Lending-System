const Reservation = require('../models/bookings');

// Create a new reservation
exports.createReservation = async (req, res) => {
  const { equipmentId, reservationDate, rentalDuration, fullName, userEmail, userPhone, specialRequests } = req.body;

  try {
    // Check if the selected reservation date is already booked for this equipment
    const existingReservation = await Reservation.findOne({
      equipmentId,
      reservationDate: new Date(reservationDate),
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'This date is already booked for the selected equipment.' });
    }

    // Create the new reservation
    const newReservation = new Reservation({
      equipmentId,
      reservationDate: new Date(reservationDate),
      rentalDuration,
      fullName,
      userEmail,
      userPhone,
      specialRequests,
    });

    await newReservation.save();
    res.status(201).json({ message: 'Reservation created successfully', reservation: newReservation });
  } catch (error) {
    res.status(500).json({ message: 'Error creating reservation', error });
  }
};

// Fetch booked dates for specific equipment
exports.getBookedDates = async (req, res) => {
  const { equipmentId } = req.params;

  try {
    const reservations = await Reservation.find({ equipmentId }).select('reservationDate');
    const bookedDates = reservations.map(reservation => reservation.reservationDate);
    res.status(200).json(bookedDates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booked dates', error });
  }
};
