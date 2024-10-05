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

function ReservationTable() {
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("/api/bookings/all");
      setReservations(response.data);
    } catch (error) {
      console.error("Failed to fetch reservations", error);
    }
  };

  const filteredReservations = reservations.filter((reservation) =>
    reservation.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = filteredReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

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
      "Rental Duration",
      "Special Request",
      "Reservation Date",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredReservations.map((reservation) => {
        const date = new Date(reservation.createdAt);
        const formattedDate = isNaN(date) ? "Invalid Date" : format(date, "PP");
        return [
          reservation.fullName,
          reservation.userEmail,
          reservation.userPhone,
          reservation.rentalDuration,
          reservation.specialRequest || "N/A",
          formattedDate,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "reservations.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card className={styles.bookingTableCard}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.cardTitle}>Reservation Records</CardTitle>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <div className={styles.topSection}>
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
          <Button onClick={exportToCSV} className={styles.exportButton}>
            <Download className={styles.exportIcon} /> Export to CSV
          </Button>
        </div>
        <div className={styles.tableWrapper}>
          <Table className={styles.table}>
            <TableHeader>
              <TableRow className={styles.tableHeaderRow}>
                <TableHead className={styles.tableHead}>Full Name</TableHead>
                <TableHead className={styles.tableHead}>Email</TableHead>
                <TableHead className={styles.tableHead}>Phone</TableHead>
                <TableHead className={styles.tableHead}>Rental Duration</TableHead>
                <TableHead className={styles.tableHead}>Special Request</TableHead>
                <TableHead className={styles.tableHead}>Reservation Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReservations.map((reservation) => {
                const date = new Date(reservation.createdAt);
                const formattedDate = isNaN(date) ? "Invalid Date" : format(date, "PP");
                return (
                  <TableRow key={reservation._id} className={styles.tableRow}>
                    <TableCell className={styles.tableCell}>{reservation.fullName}</TableCell>
                    <TableCell className={styles.tableCell}>{reservation.userEmail}</TableCell>
                    <TableCell className={styles.tableCell}>{reservation.userPhone}</TableCell>
                    <TableCell className={styles.tableCell}>{reservation.rentalDuration}</TableCell>
                    <TableCell className={styles.tableCell}>{reservation.specialRequest || 'N/A'}</TableCell>
                    <TableCell className={styles.tableCell}>{formattedDate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
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

export default ReservationTable;
