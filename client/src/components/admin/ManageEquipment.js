/* Updated React Component for Managing Equipment */
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
import styles from "./ManageEquipment.module.css";

function ManageEquipment() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [newEquipment, setNewEquipment] = useState({
    image: "",
    name: "",
    availabilityDate: "",
    location: "",
  });
  const [editEquipment, setEditEquipment] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredEquipment(equipmentList.slice(startIndex, endIndex));
  }, [equipmentList, currentPage, itemsPerPage]);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get(`/api/equipment/getEquipment`);
      setEquipmentList(response.data.equipment);
    } catch (error) {
      console.error("Failed to fetch equipment", error);
      showAlert("Failed to fetch equipment. Please try again.");
    }
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < equipmentList.length) {
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

    // Prevent numbers and invalid characters in Name and Location
    if (name === "name" || name === "location") {
      updatedValue = value.replace(/[^A-Za-z\s]/g, ""); // Only allow letters and spaces
    }

    // Validate Availability Date (only future dates)
    if (name === "availabilityDate") {
      const selectedDate = new Date(value);
      if (isBefore(selectedDate, startOfToday())) {
        updatedErrors.availabilityDate = "Please select a future date";
      } else {
        delete updatedErrors.availabilityDate;
      }
    }

    setErrors(updatedErrors);
    return updatedValue;
  };

  const handleNewEquipmentChange = (e) => {
    const { name, value } = e.target;
    const validatedValue = validateInput(name, value);
    setNewEquipment({ ...newEquipment, [name]: validatedValue });
  };

  const handleEditEquipmentChange = (e) => {
    const { name, value } = e.target;
    const validatedValue = validateInput(name, value);
    setEditEquipment({ ...editEquipment, [name]: validatedValue });
  };

  const addEquipment = async () => {
    if (Object.keys(errors).length > 0) {
      showAlert("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await axios.post("/api/equipment/add-equipment", newEquipment);
      setEquipmentList([...equipmentList, response.data.equipment]);
      setNewEquipment({ image: "", name: "", availabilityDate: "", location: "" });
      setIsAddDialogOpen(false);
      showAlert("Equipment added successfully!");
    } catch (error) {
      console.error("Failed to add equipment", error);
      showAlert("Failed to add equipment. Please try again.");
    }
  };

  const updateEquipment = async () => {
    if (Object.keys(errors).length > 0) {
      showAlert("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await axios.put(
        `/api/equipment/equipment/${editEquipment._id}`,
        editEquipment
      );
      setEquipmentList(
        equipmentList.map((item) =>
          item._id === editEquipment._id ? response.data.equipment : item
        )
      );
      setEditEquipment(null);
      setIsEditDialogOpen(false);
      showAlert("Equipment updated successfully!");
    } catch (error) {
      console.error("Failed to update equipment", error);
      showAlert("Failed to update equipment. Please try again.");
    }
  };

  const deleteEquipment = async (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        await axios.delete(`/api/equipment/equipment/${id}`);
        setEquipmentList(equipmentList.filter((item) => item._id !== id));
        showAlert("Equipment deleted successfully!");
      } catch (error) {
        console.error("Failed to delete equipment", error);
        showAlert("Failed to delete equipment. Please try again.");
      }
    }
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 3000);
  };

  const totalPages = Math.ceil(equipmentList.length / itemsPerPage);

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.cardTitle}>Manage Equipment</CardTitle>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        {alertMessage && (
          <Alert className={styles.alert}>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <div className={styles.headerSection}>
          <h2 className={styles.equipmentListTitle}>Equipment List</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className={styles.addButton}>
                <Plus className={styles.icon} /> Add New Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className={styles.dialogContent}>
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
              </DialogHeader>
              <div className={styles.formGrid}>
                <Input
                  placeholder="Image URL"
                  name="image"
                  value={newEquipment.image}
                  onChange={handleNewEquipmentChange}
                />

                <Input
                  placeholder="Name"
                  name="name"
                  value={newEquipment.name}
                  onChange={handleNewEquipmentChange}
                />
                {errors.name && <p className={styles.errorText}>{errors.name}</p>}

                <Input
                  type="date"
                  name="availabilityDate"
                  value={newEquipment.availabilityDate}
                  onChange={handleNewEquipmentChange}
                />
                {errors.availabilityDate && <p className={styles.errorText}>{errors.availabilityDate}</p>}

                <Input
                  placeholder="Location"
                  name="location"
                  value={newEquipment.location}
                  onChange={handleNewEquipmentChange}
                />
                {errors.location && <p className={styles.errorText}>{errors.location}</p>}

                <Button
                  onClick={addEquipment}
                  className={styles.saveButton}
                >
                  Add Equipment
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
                <TableHead className={styles.tableHead}>Name</TableHead>
                <TableHead className={styles.tableHead}>Availability Date</TableHead>
                <TableHead className={styles.tableHead}>Location</TableHead>
                <TableHead className={styles.tableHead}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => (
                <TableRow
                  key={item._id}
                  className={styles.tableRow}
                >
                  <TableCell>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.equipmentImage}
                    />
                  </TableCell>
                  <TableCell className={styles.tableCell}>{item.name}</TableCell>
                  <TableCell>{format(new Date(item.availabilityDate), "PP")}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <div className={styles.actionButtons}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditEquipment(item);
                          setIsEditDialogOpen(true);
                        }}
                        className={styles.editButton}
                      >
                        <Pencil className={styles.icon} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteEquipment(item._id)}
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
              <DialogTitle>Edit Equipment</DialogTitle>
            </DialogHeader>
            {editEquipment && (
              <div className={styles.formGrid}>
                <Input
                  placeholder="Image URL"
                  name="image"
                  value={editEquipment.image}
                  onChange={handleEditEquipmentChange}
                />

                <Input
                  placeholder="Name"
                  name="name"
                  value={editEquipment.name}
                  onChange={handleEditEquipmentChange}
                />
                {errors.name && <p className={styles.errorText}>{errors.name}</p>}

                <Input
                  type="date"
                  name="availabilityDate"
                  value={format(new Date(editEquipment.availabilityDate), "yyyy-MM-dd")}
                  onChange={handleEditEquipmentChange}
                />
                {errors.availabilityDate && <p className={styles.errorText}>{errors.availabilityDate}</p>}

                <Input
                  placeholder="Location"
                  name="location"
                  value={editEquipment.location}
                  onChange={handleEditEquipmentChange}
                />
                {errors.location && (
                  <p className={styles.errorText}>{errors.location}</p>
                )}

                <Button
                  onClick={updateEquipment}
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

export default ManageEquipment;
