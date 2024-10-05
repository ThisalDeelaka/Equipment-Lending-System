const Reservation = require('../models/bookings');

// Create a new reservation
exports.createReservation = async (req, res) => {
  const { equipmentId, reservationDates, fullName, userEmail, userPhone, specialRequests } = req.body;

  try {
    // Convert the reservationDates to a date range (array of dates)
    const parsedDates = reservationDates.map(date => new Date(date));

    // Check if any date within the selected range is already booked
    const existingReservation = await Reservation.find({
      equipmentId,
      reservationDate: { $in: parsedDates }, // Check if any date in the array is already reserved
    });

    if (existingReservation.length > 0) {
      return res.status(400).json({ message: 'One or more dates are already booked for the selected equipment.' });
    }

    // Create the new reservations for each date in the range
    const newReservations = parsedDates.map(date => ({
      equipmentId,
      reservationDate: date,
      fullName,
      userEmail,
      userPhone,
      specialRequests,
    }));

    await Reservation.insertMany(newReservations); // Insert all dates at once

    res.status(201).json({ message: 'Reservations created successfully', reservations: newReservations });
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

// Fetch all reservations by user email
exports.getReservationsByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const reservations = await Reservation.find({ userEmail: email });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations for the user', error });
  }
};

// Fetch all reservations (admin feature)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all reservations', error });
  }
};


// Update reservation by ID
exports.updateReservation = async (req, res) => {
    const { id } = req.params;
    const { fullName, userEmail, userPhone, specialRequests } = req.body;
  
    try {
      const updatedReservation = await Reservation.findByIdAndUpdate(
        id,
        {
          fullName,
          userEmail,
          userPhone,
          specialRequests,
        },
        { new: true } // Returns the updated document
      );
  
      if (!updatedReservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
  
      res.status(200).json({ message: 'Reservation updated successfully', reservation: updatedReservation });
    } catch (error) {
      res.status(500).json({ message: 'Error updating reservation', error });
    }
  };
  
  // Delete reservation by ID
  exports.deleteReservation = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedReservation = await Reservation.findByIdAndDelete(id);
  
      if (!deletedReservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
  
      res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting reservation', error });
    }
  };