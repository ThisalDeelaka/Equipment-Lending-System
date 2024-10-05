const express = require('express');
const router = express.Router();
const reservationController = require('../controller/bookingController');

// Route to create a new reservation
router.post('/create', reservationController.createReservation);

// Route to fetch booked dates for a specific equipment
router.get('/bookedDates/:equipmentId', reservationController.getBookedDates);

// Route to fetch all reservations for a specific user by email
router.get('/user/:email', reservationController.getReservationsByEmail);

module.exports = router;
