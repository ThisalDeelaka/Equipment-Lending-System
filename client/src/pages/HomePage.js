import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/tickets/getTickets");
      setEvents(response.data.tickets || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCardClick = (eventId) => {
    navigate(`/booking/${eventId}`);
  };

  const handleMyEventsClick = () => {
    navigate('/eventDetails'); // Redirect to /eventDetails
  };

  const filteredEvents = events.filter((event) => {
    const searchTextMatch =
      (event.title && event.title.toLowerCase().includes(searchText.toLowerCase())) ||
      (event.description && event.description.toLowerCase().includes(searchText.toLowerCase()));

    return searchTextMatch;
  });

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Farmcart</h1>
          <h2 className={styles.heroSubtitle}>
            Explore Fresh Local Farm Events Near You
          </h2>
          <p className={styles.heroText}>
            Discover the best farm events around your area. Shop fresh produce directly from farmers and participate in unique experiences.
          </p>
          <div className={styles.heroButtons}>
            <button
              className={styles.myEventsButton}
              onClick={handleMyEventsClick}
            >
              My Events
            </button>
            <button className={styles.learnMoreButton}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className={styles.searchSection}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by Event or Farm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </section>

      {/* Upcoming Events Section */}
      <section className={styles.upcomingEventsSection}>
        <h3 className={styles.sectionTitle}>Upcoming Farm Events</h3>
        <div className={styles.eventsGrid}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event._id}
                className={styles.eventCard}
                onClick={() => handleCardClick(event._id)}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className={styles.eventImage}
                />
                <div className={styles.eventContent}>
                  <p className={styles.eventDate}>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <h4 className={styles.eventTitle}>{event.title}</h4>
                  <p className={styles.eventLocation}>{event.location}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noEventsMessage}>No upcoming events found.</p>
          )}
        </div>
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreButton}>Load More</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;