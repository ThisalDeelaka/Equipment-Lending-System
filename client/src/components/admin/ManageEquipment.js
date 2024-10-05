import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/cards";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import styles from "./ManageEquipment.module.css";

function ManageEquipment() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "",
    condition: "Good",
    status: "Available",
    image: null,
  });
  const [editEquipment, setEditEquipment] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
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
      setEquipmentList(response.data.equipments || []);
    } catch (error) {
      console.error("Failed to fetch equipment", error);
      showAlert("Failed to fetch equipment. Please try again.");
    }
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < (equipmentList?.length || 0)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleFileChange = (e) => {
    setNewEquipment({ ...newEquipment, image: e.target.files[0] });
  };

  const handleNewEquipmentChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment({ ...newEquipment, [name]: value });
  };

  const handleEditEquipmentChange = (e) => {
    const { name, value } = e.target;
    setEditEquipment({ ...editEquipment, [name]: value });
  };

  const addEquipment = async () => {
    const formData = new FormData();
    formData.append("name", newEquipment.name);
    formData.append("type", newEquipment.type);
    formData.append("condition", newEquipment.condition);
    formData.append("status", newEquipment.status);
    if (newEquipment.image) {
      formData.append("image", newEquipment.image);
    }

    try {
      const response = await axios.post("/api/equipment/add-equipment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setEquipmentList([...equipmentList, response.data.equipment]);
      setNewEquipment({ name: "", type: "", condition: "Good", status: "Available", image: null });
      setIsAddDialogOpen(false);
      showAlert("Equipment added successfully!");
    } catch (error) {
      console.error("Failed to add equipment", error);
      showAlert("Failed to add equipment. Please try again.");
    }
  };

  const updateEquipment = async () => {
    const formData = new FormData();
    formData.append("name", editEquipment.name);
    formData.append("type", editEquipment.type);
    formData.append("condition", editEquipment.condition);
    formData.append("status", editEquipment.status);
    if (editEquipment.image) {
      formData.append("image", editEquipment.image);
    }

    try {
      const response = await axios.put(`/api/equipment/upequipment/${editEquipment._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setEquipmentList(
        equipmentList.map((item) => (item._id === editEquipment._id ? response.data.equipment : item))
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
        await axios.delete(`/api/equipment/delequipment/${id}`);
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

  const totalPages = Math.ceil((equipmentList?.length || 0) / itemsPerPage);

  return (
    <Card className={`${styles.card} ${styles.adjustForSidebarNavbar}`}>
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
                {/* Row 1: Name */}
                <div className={styles.formRow}>
                  <label htmlFor="name">Name</label>
                  <Input
                    id="name"
                    placeholder="Name"
                    name="name"
                    value={newEquipment.name}
                    onChange={handleNewEquipmentChange}
                  />
                </div>

                {/* Row 2: Type */}
                <div className={styles.formRow}>
                  <label htmlFor="type">Type</label>
                  <Input
                    id="type"
                    placeholder="Type"
                    name="type"
                    value={newEquipment.type}
                    onChange={handleNewEquipmentChange}
                  />
                </div>

                {/* Additional fields */}
                <label htmlFor="condition">Condition</label>
                <select
                  id="condition"
                  name="condition"
                  value={newEquipment.condition}
                  onChange={handleNewEquipmentChange}
                >
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>

                <fieldset>
                  <legend>Status</legend>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="Available"
                      checked={newEquipment.status === "Available"}
                      onChange={handleNewEquipmentChange}
                    />
                    Available
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="Unavailable"
                      checked={newEquipment.status === "Unavailable"}
                      onChange={handleNewEquipmentChange}
                    />
                    Unavailable
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="Under Maintenance"
                      checked={newEquipment.status === "Under Maintenance"}
                      onChange={handleNewEquipmentChange}
                    />
                    Under Maintenance
                  </label>
                </fieldset>

                <Input type="file" accept="image/*" onChange={handleFileChange} />

                <Button onClick={addEquipment} className={styles.saveButton}>
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
                <TableHead className={styles.tableHead}>Name</TableHead>
                <TableHead className={styles.tableHead}>Type</TableHead>
                <TableHead className={styles.tableHead}>Condition</TableHead>
                <TableHead className={styles.tableHead}>Status</TableHead>
                <TableHead className={styles.tableHead}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map((item) => (
                  <TableRow key={item._id} className={styles.tableRow}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.condition}</TableCell>
                    <TableCell>{item.status}</TableCell>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="5">No equipment available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className={styles.paginationContainer}>
          <Button onClick={handlePreviousPage} disabled={currentPage === 1} className={styles.paginationButton}>
            <ChevronLeft className={styles.icon} /> Previous
          </Button>
          <span className={styles.paginationInfo}>Page {currentPage} of {totalPages}</span>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages} className={styles.paginationButton}>
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
                  placeholder="Name"
                  name="name"
                  value={editEquipment.name}
                  onChange={handleEditEquipmentChange}
                />
                <Input
                  placeholder="Type"
                  name="type"
                  value={editEquipment.type}
                  onChange={handleEditEquipmentChange}
                />

                <label htmlFor="condition">Condition</label>
                <select
                  id="condition"
                  name="condition"
                  value={editEquipment.condition}
                  onChange={handleEditEquipmentChange}
                >
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>

                <fieldset>
                  <legend>Status</legend>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="Available"
                      checked={editEquipment.status === "Available"}
                      onChange={handleEditEquipmentChange}
                    />
                    Available
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="Unavailable"
                      checked={editEquipment.status === "Unavailable"}
                      onChange={handleEditEquipmentChange}
                    />
                    Unavailable
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="Under Maintenance"
                      checked={editEquipment.status === "Under Maintenance"}
                      onChange={handleEditEquipmentChange}
                    />
                    Under Maintenance
                  </label>
                </fieldset>

                <Input type="file" accept="image/*" onChange={handleFileChange} />

                <Button onClick={updateEquipment} className={styles.saveButton}>
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
