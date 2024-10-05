import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
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
    const navigate = useNavigate(); // Initialize useNavigate

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

    // Handle form input changes with validation
    const handleChange = (e) => {
        const { name, value } = e.target;
        let inputValue = value;
        let updatedErrors = { ...errors };

        // Validation logic for Full Name (only alphabetic characters and space)
        if (name === 'fullName') {
            inputValue = value.replace(/[^A-Za-z\s]/g, ''); // Remove non-alphabetic characters
            if (value !== inputValue) {
                updatedErrors.fullName = 'Only letters and spaces are allowed for Full Name';
            } else {
                delete updatedErrors.fullName;
            }
        }

        // Validation logic for Phone (only numbers, and exactly 10 digits)
        if (name === 'phone') {
            inputValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
            if (inputValue.length > 10) {
                inputValue = inputValue.slice(0, 10); // Restrict to 10 digits
            }
            if (inputValue.length !== 10) {
                updatedErrors.phone = 'Phone number must be exactly 10 digits';
            } else {
                delete updatedErrors.phone;
            }
        }

        setFormData({ ...formData, [name]: inputValue });
        setErrors(updatedErrors);
    };

    // Handle date range selection
    const handleDateChange = (dates) => {
        setSelectedDates(dates); // Set the selected range of dates
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for errors before submission
        if (Object.keys(errors).length > 0) {
            alert('Please fix the errors in the form.');
            return;
        }

        try {
            const startDate = new Date(selectedDates[0]);
            const endDate = new Date(selectedDates[1]);
            const dateArray = [];

            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                dateArray.push(new Date(date));
            }

            const bookingData = {
                equipmentId: id,
                equipmentName: equipment.name,
                fullName: formData.fullName,
                userEmail: formData.email,
                userPhone: formData.phone,
                specialRequests: formData.specialRequests,
                reservationDates: dateArray
            };

            const response = await axios.post('/api/bookings/create', bookingData);

            if (response.status === 201) {
                alert('Booking created successfully!');
                navigate('/'); // Navigate to home after successful booking
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
                            {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
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
                            {errors.phone && <p className={styles.error}>{errors.phone}</p>}
                        </div>

                        {/* Calendar Component */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Select Reservation Date</label>
                            <Calendar
                                selectRange
                                onChange={handleDateChange}
                                value={selectedDates}
                                tileDisabled={tileDisabled}
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
