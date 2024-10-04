import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EventManagement.module.css';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ id: null, name: '', description: '', date: '', location: '', image: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/events');
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/events/${newEvent.id}`, newEvent);
        setIsEditing(false);
      } else {
        await axios.post('/api/events', newEvent);
      }
      setNewEvent({ id: null, name: '', description: '', date: '', location: '', image: '' });
      fetchEvents();
    } catch (err) {
      setError('Failed to save the event');
    }
  };

  const handleEdit = (event) => {
    setNewEvent(event);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/events/${id}`);
      fetchEvents();
    } catch (err) {
      setError('Failed to delete the event');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>Event Management</h2>

        {/* Error Message */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Event Form */}
        <form onSubmit={handleSubmit} className={styles.eventForm}>
          <div className={styles.inputGrid}>
            <input
              className={styles.input}
              name="name"
              value={newEvent.name}
              onChange={handleInputChange}
              placeholder="Event Name"
              required
            />
            <input
              className={styles.input}
              name="location"
              value={newEvent.location}
              onChange={handleInputChange}
              placeholder="Location"
              required
            />
          </div>

          <input
            className={styles.input}
            name="description"
            value={newEvent.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
          />

          <div className={styles.inputGrid}>
            <input
              className={styles.input}
              name="date"
              type="date"
              value={newEvent.date}
              onChange={handleInputChange}
              required
            />
            <input
              className={styles.input}
              name="image"
              value={newEvent.image}
              onChange={handleInputChange}
              placeholder="Image URL"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
          >
            {isEditing ? 'Update Event' : 'Add Event'}
          </button>
        </form>

        {/* Loading State */}
        {loading ? (
          <p className={styles.loadingText}>Loading events...</p>
        ) : (
          <ul className={styles.eventList}>
            {events.map((event) => (
              <li key={event._id} className={styles.eventCard}>
                <div className={styles.eventInfo}>
                  <h3 className={styles.eventName}>{event.name}</h3>
                  <p className={styles.eventDetails}>
                    {new Date(event.date).toLocaleDateString()} - {event.location}
                  </p>
                </div>
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => handleEdit(event)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
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

export default EventManagement;