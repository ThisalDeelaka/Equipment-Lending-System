import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/cards";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { Input } from "../ui/input";
import styles from "./BookingTable.module.css";

function BookingTable() {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/api/bookings/all");
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = [
      "Full Name",
      "Email",
      "Phone",
      "Ticket Quantity",
      "Ticket Type",
      "Special Request",
      "Booking Date",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredBookings.map((booking) =>
        [
          booking.fullName,
          booking.userEmail,
          booking.userPhone,
          booking.ticketQuantity,
          booking.ticketType,
          booking.specialRequest || "N/A",
          format(new Date(booking.createdAt), "PP"),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "bookings.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card className={styles.bookingTableCard}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.cardTitle}>Booking Records</CardTitle>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <div className={styles.topSection}>
          {/* Search Input */}
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <Input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>

          {/* Export Button */}
          <Button
            onClick={exportToCSV}
            className={styles.exportButton}
          >
            <Download className={styles.exportIcon} /> Export to CSV
          </Button>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <Table className={styles.table}>
            <TableHeader>
              <TableRow className={styles.tableHeaderRow}>
                <TableHead className={styles.tableHead}>Full Name</TableHead>
                <TableHead className={styles.tableHead}>Email</TableHead>
                <TableHead className={styles.tableHead}>Phone</TableHead>
                <TableHead className={styles.tableHead}>Ticket Quantity</TableHead>
                <TableHead className={styles.tableHead}>Ticket Type</TableHead>
                <TableHead className={styles.tableHead}>Special Request</TableHead>
                <TableHead className={styles.tableHead}>Booking Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBookings.map((booking) => (
                <TableRow key={booking._id} className={styles.tableRow}>
                  <TableCell className={styles.tableCell}>{booking.fullName}</TableCell>
                  <TableCell className={styles.tableCell}>{booking.userEmail}</TableCell>
                  <TableCell className={styles.tableCell}>{booking.userPhone}</TableCell>
                  <TableCell className={styles.tableCell}>{booking.ticketQuantity}</TableCell>
                  <TableCell className={styles.tableCell}>{booking.ticketType}</TableCell>
                  <TableCell className={styles.tableCell}>{booking.specialRequest || 'N/A'}</TableCell>
                  <TableCell className={styles.tableCell}>{format(new Date(booking.createdAt), "PP")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.paginationWrapper}>
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              <ChevronLeft className={styles.paginationIcon} /> Previous
            </Button>
            <span className={styles.paginationText}>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              Next <ChevronRight className={styles.paginationIcon} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BookingTable;