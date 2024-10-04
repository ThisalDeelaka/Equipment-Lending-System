import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import styles from "./UserProfilePage.module.css";

function UserProfilePage() {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        ticketId: "",
        fullName: "",
        ticketQuantity: "",
        userEmail: "",
        userPhone: "",
        ticketType: "",
        specialRequest: "",
    });
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            setUser(currentUser);
            fetchUserBookings(currentUser.userID);
        }
    }, []);

    const fetchUserBookings = async (userID) => {
        try {
            const response = await axios.get(`/api/bookings/user/${userID}`);
            setBookings(response.data.bookings);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            message.error("Failed to fetch bookings. Please try again.");
        }
    };

    const handleEditBooking = (booking) => {
        setIsEditing(true);
        setFormData({
            _id: booking._id,
            ticketId: booking.ticketId,
            fullName: booking.fullName,
            ticketQuantity: booking.ticketQuantity,
            userEmail: booking.userEmail,
            userPhone: booking.userPhone,
            ticketType: booking.ticketType,
            specialRequest: booking.specialRequest,
        });
    };

    const handleDeleteBooking = async (bookingId) => {
        try {
            await axios.delete(`/api/bookings/${bookingId}`);
            setBookings((prevBookings) =>
                prevBookings.filter((booking) => booking._id !== bookingId)
            );
            message.success("Booking deleted successfully");
        } catch (error) {
            console.error("Failed to delete booking", error);
            message.error("Failed to delete booking. Please try again.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = async () => {
        try {
            await updateBooking(formData);
            setIsEditing(false);
            fetchUserBookings(user.userID);
            message.success("Booking updated successfully.");
        } catch (error) {
            console.error("Failed to update booking", error);
            message.error("Failed to update booking. Please try again.");
        }
    };

    const updateBooking = async (updatedBooking) => {
        try {
            const response = await axios.put(`/api/bookings/${updatedBooking._id}`, updatedBooking);
            return response.data;
        } catch (error) {
            console.error("Error updating booking:", error);
            throw error;
        }
    };

    return (
        <div className={styles.userProfilePage}>
            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/1200px-Windows_10_Default_Profile_Picture.svg.png"
                        alt="Profile"
                    />
                    <div className={styles.profileInfo}>
                        <h3>
                            {user.firstName} {user.lastName}
                        </h3>
                        <p>{user.userType}</p>
                    </div>
                </div>
                <div className={styles.profileDetails}>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>Username:</strong> {user.username}
                    </p>
                </div>
            </div>

            <div className={styles.bookingsContainer}>
                <h1>Your Tickets</h1>
                <div className={styles.bookingList}>
                    {bookings.length === 0 ? (
                        <p>You have no bookings.</p>
                    ) : (
                        bookings.map((booking) => (
                            <div key={booking._id} className={styles.bookingCard}>
                                <h3>Ticket ID: {booking.ticketId}</h3>
                                <p>
                                    <strong>Full Name:</strong> {booking.fullName}
                                </p>
                                <p>
                                    <strong>Quantity:</strong> {booking.ticketQuantity}
                                </p>
                                <p>
                                    <strong>Email:</strong> {booking.userEmail}
                                </p>
                                <p>
                                    <strong>Phone:</strong> {booking.userPhone}
                                </p>
                                <p>
                                    <strong>Ticket Type:</strong> {booking.ticketType}
                                </p>
                                <p>
                                    <strong>Special Request:</strong>{" "}
                                    <span className={styles.specialRequest}>
                                        {booking.specialRequest || "None"}
                                    </span>
                                </p>
                                <div className={styles.bookingActions}>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => handleEditBooking(booking)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteBooking(booking._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {isEditing && (
                <div className={styles.editModal}>
                    <div className={styles.modalContent}>
                        <h3>Edit Booking</h3>
                        <label>
                            Full Name:
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Ticket Quantity:
                            <input
                                type="number"
                                name="ticketQuantity"
                                value={formData.ticketQuantity}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="userEmail"
                                value={formData.userEmail}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Phone:
                            <input
                                type="text"
                                name="userPhone"
                                value={formData.userPhone}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Ticket Type:
                            <input
                                type="text"
                                name="ticketType"
                                value={formData.ticketType}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Special Request:
                            <input
                                type="text"
                                name="specialRequest"
                                value={formData.specialRequest}
                                onChange={handleInputChange}
                            />
                        </label>
                        <div className={styles.modalButtons}>
                            <button className={styles.saveButton} onClick={handleSave}>
                                Save
                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfilePage;