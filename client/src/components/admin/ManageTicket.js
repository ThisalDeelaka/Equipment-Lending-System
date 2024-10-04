/* Updated React Component with CSS Modules */
import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { format, isBefore, startOfToday } from "date-fns";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/cards";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import styles from "./ManageTicket.module.css";

function ManageTicket() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    image: "",
    title: "",
    date: "",
    location: "",
  });
  const [editTicket, setEditTicket] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredTickets(tickets.slice(startIndex, endIndex));
  }, [tickets, currentPage, itemsPerPage]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`/api/tickets/getTickets`);
      setTickets(response.data.tickets);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
      showAlert("Failed to fetch tickets. Please try again.");
    }
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < tickets.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const validateInput = (name, value) => {
    let updatedValue = value;
    let updatedErrors = { ...errors };

    // Prevent numbers and invalid characters in Title and Location
    if (name === "title" || name === "location") {
      updatedValue = value.replace(/[^A-Za-z\s]/g, ""); // Only allow letters and spaces
    }

    // Validate Date (only future dates)
    if (name === "date") {
      const selectedDate = new Date(value);
      if (isBefore(selectedDate, startOfToday())) {
        updatedErrors.date = "Please select a future date";
      } else {
        delete updatedErrors.date;
      }
    }

    setErrors(updatedErrors);
    return updatedValue;
  };

  const handleNewTicketChange = (e) => {
    const { name, value } = e.target;
    const validatedValue = validateInput(name, value);
    setNewTicket({ ...newTicket, [name]: validatedValue });
  };

  const handleEditTicketChange = (e) => {
    const { name, value } = e.target;
    const validatedValue = validateInput(name, value);
    setEditTicket({ ...editTicket, [name]: validatedValue });
  };

  const addTicket = async () => {
    if (Object.keys(errors).length > 0) {
      showAlert("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await axios.post("/api/tickets/add-ticket", newTicket);
      setTickets([...tickets, response.data.ticket]);
      setNewTicket({ image: "", title: "", date: "", location: "" });
      setIsAddDialogOpen(false);
      showAlert("Ticket added successfully!");
    } catch (error) {
      console.error("Failed to add ticket", error);
      showAlert("Failed to add ticket. Please try again.");
    }
  };

  const updateTicket = async () => {
    if (Object.keys(errors).length > 0) {
      showAlert("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await axios.put(
        `/api/tickets/tickets/${editTicket._id}`,
        editTicket
      );
      setTickets(
        tickets.map((ticket) =>
          ticket._id === editTicket._id ? response.data.ticket : ticket
        )
      );
      setEditTicket(null);
      setIsEditDialogOpen(false);
      showAlert("Ticket updated successfully!");
    } catch (error) {
      console.error("Failed to update ticket", error);
      showAlert("Failed to update ticket. Please try again.");
    }
  };

  const deleteTicket = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await axios.delete(`/api/tickets/tickets/${id}`);
        setTickets(tickets.filter((ticket) => ticket._id !== id));
        showAlert("Ticket deleted successfully!");
      } catch (error) {
        console.error("Failed to delete ticket", error);
        showAlert("Failed to delete ticket. Please try again.");
      }
    }
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 3000);
  };

  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.cardTitle}>Manage Events</CardTitle>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        {alertMessage && (
          <Alert className={styles.alert}>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <div className={styles.headerSection}>
          <h2 className={styles.eventsListTitle}>Events List</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className={styles.addButton}>
                <Plus className={styles.icon} /> Add New Event
              </Button>
            </DialogTrigger>
            <DialogContent className={styles.dialogContent}>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className={styles.formGrid}>
                <Input
                  placeholder="Image URL"
                  name="image"
                  value={newTicket.image}
                  onChange={handleNewTicketChange}
                />

                <Input
                  placeholder="Title"
                  name="title"
                  value={newTicket.title}
                  onChange={handleNewTicketChange}
                />
                {errors.title && <p className={styles.errorText}>{errors.title}</p>}

                <Input
                  type="date"
                  name="date"
                  value={newTicket.date}
                  onChange={handleNewTicketChange}
                />
                {errors.date && <p className={styles.errorText}>{errors.date}</p>}

                <Input
                  placeholder="Location"
                  name="location"
                  value={newTicket.location}
                  onChange={handleNewTicketChange}
                />
                {errors.location && <p className={styles.errorText}>{errors.location}</p>}

                <Button
                  onClick={addTicket}
                  className={styles.saveButton}
                >
                  Add Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className={styles.tableContainer}>
          <Table>
            <TableHeader>
              <TableRow className={styles.tableHeaderRow}>
                <TableHead className={styles.tableHead}>Image</TableHead>
                <TableHead className={styles.tableHead}>Title</TableHead>
                <TableHead className={styles.tableHead}>Date</TableHead>
                <TableHead className={styles.tableHead}>Location</TableHead>
                <TableHead className={styles.tableHead}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket._id}
                  className={styles.tableRow}
                >
                  <TableCell>
                    <img
                      src={ticket.image}
                      alt={ticket.title}
                      className={styles.ticketImage}
                    />
                  </TableCell>
                  <TableCell className={styles.tableCell}>{ticket.title}</TableCell>
                  <TableCell>{format(new Date(ticket.date), "PP")}</TableCell>
                  <TableCell>{ticket.location}</TableCell>
                  <TableCell>
                    <div className={styles.actionButtons}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditTicket(ticket);
                          setIsEditDialogOpen(true);
                        }}
                        className={styles.editButton}
                      >
                        <Pencil className={styles.icon} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTicket(ticket._id)}
                        className={styles.deleteButton}
                      >
                        <Trash2 className={styles.icon} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className={styles.paginationContainer}>
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            <ChevronLeft className={styles.icon} /> Previous
          </Button>
          <span className={styles.paginationInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Next <ChevronRight className={styles.icon} />
          </Button>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className={styles.dialogContent}>
            <DialogHeader>
              <DialogTitle>Edit Ticket</DialogTitle>
            </DialogHeader>
            {editTicket && (
              <div className={styles.formGrid}>
                <Input
                  placeholder="Image URL"
                  name="image"
                  value={editTicket.image}
                  onChange={handleEditTicketChange}
                />

                <Input
                  placeholder="Title"
                  name="title"
                  value={editTicket.title}
                  onChange={handleEditTicketChange}
                />
                {errors.title && <p className={styles.errorText}>{errors.title}</p>}

                <Input
                  type="date"
                  name="date"
                  value={format(new Date(editTicket.date), "yyyy-MM-dd")}
                  onChange={handleEditTicketChange}
                />
                {errors.date && <p className={styles.errorText}>{errors.date}</p>}

                <Input
                  placeholder="Location"
                  name="location"
                  value={editTicket.location}
                  onChange={handleEditTicketChange}
                />
                {errors.location && (
                  <p className={styles.errorText}>{errors.location}</p>
                )}

                <Button
                  onClick={updateTicket}
                  className={styles.saveButton}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default ManageTicket;