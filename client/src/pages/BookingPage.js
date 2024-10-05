import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import styles from './BookingPage.module.css';

const BookingPage = () => {
    const { id } = useParams(); // Get the equipment ID from the URL
    const [equipment, setEquipment] = useState(null); // Store equipment data
    const [bookedDates, setBookedDates] = useState([]); // Store already booked dates
    const [selectedDates, setSelectedDates] = useState([]); // Updated to handle multiple selected dates
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        specialRequests: ''
    });
    const [errors, setErrors] = useState({});

    // Fetch current user details from local storage
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                email: currentUser.email
            }));
        }
    }, []);

    // Fetch equipment details and booked dates
    useEffect(() => {
        const fetchEquipmentDetails = async () => {
            try {
                const response = await axios.get(`/api/equipment/getEquipment/${id}`);
                setEquipment(response.data.equipment);
            } catch (error) {
                console.error('Error fetching equipment details:', error);
            }
        };

        const fetchBookedDates = async () => {
            try {
                const response = await axios.get(`/api/bookings/bookedDates/${id}`);
                setBookedDates(response.data);
            } catch (error) {
                console.error('Error fetching booked dates:', error);
            }
        };

        fetchEquipmentDetails();
        fetchBookedDates();
    }, [id]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle date range selection
    const handleDateChange = (dates) => {
        setSelectedDates(dates); // Set the selected range of dates
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.keys(errors).length > 0) {
            alert('Please fix the errors in the form.');
            return;
        }

        try {
            // Loop over each date in the selected range and create booking requests
            const startDate = new Date(selectedDates[0]);
            const endDate = new Date(selectedDates[1]);
            const dateArray = [];

            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                dateArray.push(new Date(date));
            }

            const bookingData = {
                equipmentId: id,
                fullName: formData.fullName,
                userEmail: formData.email,
                userPhone: formData.phone,
                specialRequests: formData.specialRequests,
                reservationDates: dateArray // Send array of selected dates to the backend
            };

            const response = await axios.post('/api/bookings/create', bookingData);

            if (response.status === 201) {
                alert('Booking created successfully!');
            } else {
                console.error('Error creating booking:', response.data.message);
            }
        } catch (error) {
            console.error('Error submitting the booking:', error);
        }
    };

    // Disable already booked dates in the calendar
    const tileDisabled = ({ date }) => {
        return bookedDates.some((bookedDate) => {
            const booked = new Date(bookedDate);
            return booked.toDateString() === date.toDateString();
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.bookingCard}>
                {/* Equipment Image in the Header */}
                {equipment && (
                    <div className={styles.equipmentImageContainer}>
                        <img
                            src={`/${equipment.imageUrl}`}
                            alt={equipment.name}
                            className={styles.equipmentImage}
                        />
                    </div>
                )}

                {/* Booking Form Section */}
                <div className={styles.bookingFormSection}>
                    <h1 className={styles.title}>Reserve Equipment</h1>
                    <p className={styles.subtitle}>Fill out the details below to confirm your reservation.</p>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div className={styles.formGroup}>
                            <label htmlFor="fullName" className={styles.label}>Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                className={styles.input}
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        {/* Email (disabled) */}
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={styles.input}
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div className={styles.formGroup}>
                            <label htmlFor="phone" className={styles.label}>Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className={styles.input}
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="07X XXXXXXX"
                                required
                            />
                        </div>

                        {/* Calendar Component */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Select Reservation Date</label>
                            <Calendar
                                selectRange // Enable date range selection
                                onChange={handleDateChange} // Handle range selection
                                value={selectedDates}
                                tileDisabled={tileDisabled} // Disable already booked dates
                                className={styles.customCalendar}
                            />
                        </div>

                        {/* Special Requests */}
                        <div className={styles.formGroup}>
                            <label htmlFor="specialRequests" className={styles.label}>Special Requests</label>
                            <textarea
                                id="specialRequests"
                                name="specialRequests"
                                className={styles.textarea}
                                value={formData.specialRequests}
                                onChange={handleChange}
                                placeholder="Any special requests?"
                            />
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className={styles.submitButton}>
                            Confirm Reservation
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
