import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { FaEdit, FaTrashAlt, FaDownload, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import styles from "./EquipmentDetails.module.css";
import logo from '../assets/Logo/logo.jpg'; 

function EquipmentDetails() {
  const [reservations, setReservations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    fullName: "",
    userEmail: "",
    userPhone: "",
    specialRequests: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReservations, setFilteredReservations] = useState([]);

  // Fetch current user data
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userEmail = currentUser ? currentUser.email : null;

  useEffect(() => {
    if (userEmail) {
      fetchReservations(userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [reservations, searchTerm]);

  // Fetch reservations by user email
  const fetchReservations = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/user/${email}`);
      setReservations(response.data);
    } catch (error) {
      console.error("Failed to fetch reservations", error);
      message.error("Failed to fetch reservations. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let updatedErrors = { ...errors };

    // Validation for Full Name (only alphabetic characters and spaces)
    if (name === "fullName") {
      updatedValue = value.replace(/[^A-Za-z\s]/g, "");
      if (updatedValue !== value) {
        updatedErrors.fullName = "Only letters and spaces are allowed for Full Name";
      } else {
        delete updatedErrors.fullName;
      }
    }

    if (name === "userPhone") {
      updatedValue = value.replace(/[^0-9]/g, "");
      if (updatedValue.length > 10) {
        updatedValue = updatedValue.slice(0, 10);
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

  const handleEditReservation = (reservation) => {
    setIsEditing(true);
    setFormData({
      _id: reservation._id,
      fullName: reservation.fullName,
      userEmail: reservation.userEmail,
      userPhone: reservation.userPhone,
      specialRequests: reservation.specialRequests,
    });
  };

  const updateReservation = async (updatedReservation) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/reservations/${updatedReservation._id}`,
        updatedReservation
      );
      return response.data;
    } catch (error) {
      console.error("Error updating reservation:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (Object.keys(errors).length > 0) {
      message.error("Please fix the errors in the form.");
      return;
    }

    try {
      await updateReservation(formData);
      setIsEditing(false);
      fetchReservations(userEmail);
      message.success("Reservation updated successfully.");
    } catch (error) {
      console.error("Failed to update reservation", error);
      message.error("Failed to update reservation. Please try again.");
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/reservations/${reservationId}`);
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation._id !== reservationId)
      );
      message.success("Reservation deleted successfully");
    } catch (error) {
      console.error("Failed to delete reservation", error);
      message.error("Failed to delete reservation. Please try again.");
    }
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();

    // Add a logo
    doc.addImage(logo, "PNG", 10, 10, 50, 20); // Position and size of the logo

    // Title of the report
    doc.setFontSize(24);
    doc.setTextColor(0, 128, 0); // Green color
    doc.text("Equipment Lending Report", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text(`Generated for: ${currentUser.fullName}`, 14, 50); // User's full name
    doc.text(`Email: ${currentUser.email}`, 14, 60); // User's email
    doc.text(`Generated on: ${format(new Date(), "PPpp")}`, 14, 70); // Current Date and Time

    // Add a line separator
    doc.setLineWidth(0.5);
    doc.line(14, 75, doc.internal.pageSize.getWidth() - 14, 75); // Line from left to right

    // Define the table columns and data
    const tableColumn = ["Full Name", "Email", "Phone", "Special Requests", "Reservation Date"];
    const tableRows = reservations.map((reservation) => [
      reservation.fullName,
      reservation.userEmail,
      reservation.userPhone,
      reservation.specialRequests || "None",
      format(new Date(reservation.reservationDate), "PP"), // Format reservation date
    ]);

    // Create the table with professional formatting
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 80, // Starting point for the table
      theme: "grid",
      headStyles: {
        fillColor: [239, 191, 4], // Gold-like header color
        textColor: [0, 0, 0], // Black text color
        fontSize: 12,
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [0, 0, 0],
      },
      styles: {
        halign: "left", // Align text to the left
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Set specific column widths
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 50 },
        4: { cellWidth: 30 },
      },
      margin: { top: 80 },
    });

    // Add a footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report generated by EduCode`, 14, doc.internal.pageSize.getHeight() - 10);

    // Save the PDF
    doc.save(`equipment-reservation-report-${currentUser.fullName}.pdf`);
  };

  const handleSearch = debounce((searchValue) => {
    const lowercasedFilter = searchValue.toLowerCase();
    const filteredData = reservations.filter((item) =>
      item.fullName.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredReservations(filteredData);
  }, 300);

  return (
    <div className={styles.container}>
      <section className={styles.contentSection}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Equipment Reservations</h1>
          <button onClick={handleDownloadReport} className={styles.downloadButton}>
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

        {filteredReservations.length === 0 ? (
          <div className={styles.noReservationsMessage}>
            <p>No reservations found.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Special Requests</th>
                  <th>Reservation Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation._id} className={styles.tableRow}>
                    <td>{reservation.fullName}</td>
                    <td>{reservation.userEmail}</td>
                    <td>{reservation.userPhone}</td>
                    <td>{reservation.specialRequests || "None"}</td>
                    <td>{format(new Date(reservation.reservationDate), "PP")}</td>
                    <td className={styles.actionsCell}>
                      <button onClick={() => handleEditReservation(reservation)} className={styles.editButton}>
                        <FaEdit className={styles.icon} />
                      </button>
                      <button onClick={() => handleDeleteReservation(reservation._id)} className={styles.deleteButton}>
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

      {isEditing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Edit Reservation</h3>
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
              <label>Special Requests:</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                className={styles.modalTextarea}
              />
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleSave} className={styles.saveButton}>
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EquipmentDetails;
