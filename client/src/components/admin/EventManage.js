import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EquipmentManagement.module.css';

const EquipmentManagement = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [newEquipment, setNewEquipment] = useState({ id: null, name: '', description: '', availableDate: '', location: '', image: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/equipment');
      setEquipmentList(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch equipment');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewEquipment({ ...newEquipment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/equipment/${newEquipment.id}`, newEquipment);
        setIsEditing(false);
      } else {
        await axios.post('/api/equipment', newEquipment);
      }
      setNewEquipment({ id: null, name: '', description: '', availableDate: '', location: '', image: '' });
      fetchEquipment();
    } catch (err) {
      setError('Failed to save the equipment');
    }
  };

  const handleEdit = (equipment) => {
    setNewEquipment(equipment);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/equipment/${id}`);
      fetchEquipment();
    } catch (err) {
      setError('Failed to delete the equipment');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>Equipment Management</h2>

        {/* Error Message */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Equipment Form */}
        <form onSubmit={handleSubmit} className={styles.equipmentForm}>
          <div className={styles.inputGrid}>
            <input
              className={styles.input}
              name="name"
              value={newEquipment.name}
              onChange={handleInputChange}
              placeholder="Equipment Name"
              required
            />
            <input
              className={styles.input}
              name="location"
              value={newEquipment.location}
              onChange={handleInputChange}
              placeholder="Location"
              required
            />
          </div>

          <input
            className={styles.input}
            name="description"
            value={newEquipment.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
          />

          <div className={styles.inputGrid}>
            <input
              className={styles.input}
              name="availableDate"
              type="date"
              value={newEquipment.availableDate}
              onChange={handleInputChange}
              required
            />
            <input
              className={styles.input}
              name="image"
              value={newEquipment.image}
              onChange={handleInputChange}
              placeholder="Image URL"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
          >
            {isEditing ? 'Update Equipment' : 'Add Equipment'}
          </button>
        </form>

        {/* Loading State */}
        {loading ? (
          <p className={styles.loadingText}>Loading equipment...</p>
        ) : (
          <ul className={styles.equipmentList}>
            {equipmentList.map((equipment) => (
              <li key={equipment._id} className={styles.equipmentCard}>
                <div className={styles.equipmentInfo}>
                  <h3 className={styles.equipmentName}>{equipment.name}</h3>
                  <p className={styles.equipmentDetails}>
                    {new Date(equipment.availableDate).toLocaleDateString()} - {equipment.location}
                  </p>
                </div>
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => handleEdit(equipment)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(equipment._id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EquipmentManagement;