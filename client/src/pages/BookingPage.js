import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './BookingPage.module.css';

const BookingPage = () => {
    const { id } = useParams(); // Get event ID from URL
    const [event, setEvent] = useState(null); // Store event data
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        ticketQuantity: 1,
        ticketType: '',
        specialRequests: ''
    });
    const [errors, setErrors] = useState({});
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = currentUser ? currentUser.userID : null; // Safely get userID

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`/api/tickets/getTickets/${id}`);
                setEvent(response.data); // Set event data once it's fetched
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };
        fetchEventDetails();
    }, [id]);

    // Handle form data changes with strict validation
    const handleChange = (e) => {
        const { name, value } = e.target;
        let inputValue = value;
        let updatedErrors = { ...errors };

        // Validation logic for Full Name (allow only alphabetic characters and space)
        if (name === 'fullName') {
            inputValue = value.replace(/[^A-Za-z\s]/g, ''); // Remove non-alphabetic characters
            if (value !== inputValue) {
                updatedErrors.fullName = 'Only letters and spaces are allowed for Full Name';
            } else {
                delete updatedErrors.fullName;
            }
        }

        // Validation logic for Phone (allow only numbers, and exactly 10 digits)
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

        // Validation logic for Email (check if email structure is valid)
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex pattern
            if (!emailRegex.test(value)) {
                updatedErrors.email = 'Invalid email address';
            } else {
                delete updatedErrors.email;
            }
        }

        // Set the sanitized input value to the state
        setFormData({ ...formData, [name]: inputValue });
        setErrors(updatedErrors);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform final validation checks before submission
        if (Object.keys(errors).length > 0) {
            alert('Please fix the errors in the form.');
            return;
        }

        try {
            const bookingData = {
                userId,
                ticketId: id,
                fullName: formData.fullName,
                ticketQuantity: formData.ticketQuantity,
                userEmail: formData.email,
                userPhone: formData.phone,
                ticketType: formData.ticketType,
                specialRequests: formData.specialRequests,
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

    return (
        <div className={styles.container}>
            <div className={styles.bookingCard}>
                {/* Event image section */}
                <div className={styles.eventImageSection}>
                    {event && (
                        <img
                            src={event.image}
                            alt={event.title}
                            className={styles.eventImage}
                        />
                    )}
                </div>

                {/* Booking form section */}
                <div className={styles.bookingFormSection}>
                    <h1 className={styles.title}>Reserve Your Event</h1>
                    <p className={styles.subtitle}>Fill out the details below to confirm your booking.</p>

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
                                required
                                placeholder="John Doe"
                            />
                            {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
                        </div>

                        {/* Email Address */}
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={styles.input}
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="johndoe@example.com"
                            />
                            {errors.email && <p className={styles.error}>{errors.email}</p>}
                        </div>

                        {/* Phone Number */}
                        <div className={styles.formGroup}>
                            <label htmlFor="phone" className={styles.label}>Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className={styles.input}
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="07X XXXXXXX"
                            />
                            {errors.phone && <p className={styles.error}>{errors.phone}</p>}
                        </div>

                        {/* Ticket Quantity */}
                        <div className={styles.formGroup}>
                            <label htmlFor="ticketQuantity" className={styles.label}>Number of Tickets</label>
                            <input
                                type="number"
                                id="ticketQuantity"
                                name="ticketQuantity"
                                className={styles.input}
                                value={formData.ticketQuantity}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </div>

                        {/* Ticket Type */}
                        <div className={styles.formGroup}>
                            <label htmlFor="ticketType" className={styles.label}>Ticket Type</label>
                            <select
                                id="ticketType"
                                name="ticketType"
                                className={styles.select}
                                value={formData.ticketType}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select a Ticket Type</option>
                                <option value="Standard">Standard</option>
                                <option value="VIP">VIP</option>
                                <option value="Premium">Premium</option>
                            </select>
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
                        <button
                            type="submit"
                            className={styles.submitButton}
                        >
                            Confirm Booking
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;