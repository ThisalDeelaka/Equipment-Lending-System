import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import Footer from "../components/CommonComponents/Footer";
import { FaEdit, FaTrashAlt, FaDownload, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import debounce from "lodash.debounce";
import styles from "./EventDetails.module.css";

function EventDetails() {
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    fullName: "",
    ticketQuantity: 1,
    ticketType: "",
    userEmail: "",
    userPhone: "",
    specialRequest: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [bookings, searchTerm]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bookings/all");
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      message.error("Failed to fetch bookings. Please try again.");
    }
  };

  // Handle input changes with real-time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let updatedErrors = { ...errors };

    // Restrict Full Name to alphabetic characters and spaces
    if (name === "fullName") {
      updatedValue = value.replace(/[^A-Za-z\s]/g, ""); // Remove non-alphabetic characters
      if (updatedValue !== value) {
        updatedErrors.fullName = "Only letters and spaces are allowed for Full Name";
      } else {
        delete updatedErrors.fullName;
      }
    }

    // Restrict Ticket Quantity to positive numbers only
    if (name === "ticketQuantity") {
      updatedValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      if (updatedValue !== value || updatedValue === "" || Number(updatedValue) <= 0) {
        updatedErrors.ticketQuantity = "Ticket quantity must be a positive number";
      } else {
        delete updatedErrors.ticketQuantity;
      }
    }

    // Validate Email structure
    if (name === "userEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        updatedErrors.userEmail = "Invalid email address";
      } else {
        delete updatedErrors.userEmail;
      }
    }

    // Restrict Phone to exactly 10 digits
    if (name === "userPhone") {
      updatedValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      if (updatedValue.length > 10) {
        updatedValue = updatedValue.slice(0, 10); // Limit to 10 digits
      }
      if (updatedValue.length !== 10) {
        updatedErrors.userPhone = "Phone number must be exactly 10 digits";
      } else {
        delete updatedErrors.userPhone;
      }
    }

    setFormData({ ...formData, [name]: updatedValue });
    setErrors(updatedErrors);
  };

  const handleEditBooking = (booking) => {
    setIsEditing(true);
    setFormData({
      _id: booking._id,
      fullName: booking.fullName,
      ticketQuantity: booking.ticketQuantity,
      ticketType: booking.ticketType,
      userEmail: booking.userEmail,
      userPhone: booking.userPhone,
      specialRequest: booking.specialRequest,
    });
  };

  const updateBooking = async (updatedBooking) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/bookings/${updatedBooking._id}`,
        updatedBooking
      );
      return response.data;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (Object.keys(errors).length > 0) {
      message.error("Please fix the errors in the form.");
      return;
    }

    try {
      await updateBooking(formData);
      setIsEditing(false);
      fetchBookings();
      message.success("Booking updated successfully.");
    } catch (error) {
      console.error("Failed to update booking", error);
      message.error("Failed to update booking. Please try again.");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
      message.success("Booking deleted successfully");
    } catch (error) {
      console.error("Failed to delete booking", error);
      message.error("Failed to delete booking. Please try again.");
    }
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.setTextColor(0, 128, 0); // Green color
    doc.text("FarmCart", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("Event Booking Report", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

    const tableColumn = [
      "Full Name",
      "Quantity",
      "Ticket Type",
      "Email",
      "Phone",
      "Special Request",
    ];
    const tableRows = bookings.map((booking) => [
      booking.fullName,
      booking.ticketQuantity,
      booking.ticketType,
      booking.userEmail,
      booking.userPhone,
      booking.specialRequest || "None",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      theme: "grid",
      styles: { halign: "left" },
    });

    doc.save("event-booking-report.pdf");
  };

  const handleSearch = debounce((searchValue) => {
    const lowercasedFilter = searchValue.toLowerCase();
    const filteredData = bookings.filter((item) =>
      item.fullName.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredBookings(filteredData);
  }, 300); // Debounced search for performance

  return (
    <div className={styles.container}>
      <section className={styles.contentSection}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Event Bookings</h1>
          <button
            onClick={handleDownloadReport}
            className={styles.downloadButton}
          >
            <FaDownload className={styles.icon} /> Download Report
          </button>
        </div>

        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <FaSearch className={styles.searchIcon} size={24} />
        </div>

        {filteredBookings.length === 0 ? (
          <div className={styles.noBookingsMessage}>
            <p>No bookings found.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>Full Name</th>
                  <th>Quantity</th>
                  <th>Ticket Type</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Special Request</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className={styles.tableRow}>
                    <td>{booking.fullName}</td>
                    <td>{booking.ticketQuantity}</td>
                    <td>{booking.ticketType}</td>
                    <td>{booking.userEmail}</td>
                    <td>{booking.userPhone}</td>
                    <td>{booking.specialRequest || "None"}</td>
                    <td className={styles.actionsCell}>
                      <button
                        onClick={() => handleEditBooking(booking)}
                        className={styles.editButton}
                      >
                        <FaEdit className={styles.icon} />
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className={styles.deleteButton}
                      >
                        <FaTrashAlt className={styles.icon} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Edit Modal */}
      {isEditing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Edit Booking</h3>
            <div className={styles.modalFormGroup}>
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={styles.modalInput}
              />
              {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
            </div>
            <div className={styles.modalFormGroup}>
              <label>Ticket Quantity:</label>
              <input
                type="number"
                name="ticketQuantity"
                value={formData.ticketQuantity}
                onChange={handleInputChange}
                className={styles.modalInput}
              />
              {errors.ticketQuantity && (
                <p className={styles.error}>{errors.ticketQuantity}</p>
              )}
            </div>
            <div className={styles.modalFormGroup}>
              <label>Ticket Type:</label>
              <input
                type="text"
                name="ticketType"
                value={formData.ticketType}
                onChange={handleInputChange}
                className={styles.modalInput}
              />
            </div>
            <div className={styles.modalFormGroup}>
              <label>Email:</label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleInputChange}
                className={styles.modalInput}
              />
              {errors.userEmail && <p className={styles.error}>{errors.userEmail}</p>}
            </div>
            <div className={styles.modalFormGroup}>
              <label>Phone:</label>
              <input
                type="tel"
                name="userPhone"
                value={formData.userPhone}
                onChange={handleInputChange}
                className={styles.modalInput}
              />
              {errors.userPhone && <p className={styles.error}>{errors.userPhone}</p>}
            </div>
            <div className={styles.modalFormGroup}>
              <label>Special Request:</label>
              <textarea
                name="specialRequest"
                value={formData.specialRequest}
                onChange={handleInputChange}
                className={styles.modalTextarea}
              />
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleSave} className={styles.saveButton}>
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default EventDetails;