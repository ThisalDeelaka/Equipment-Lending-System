import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const fetchEquipment = async () => {
    try {
      const response = await axios.get("/api/equipment/getEquipment");
      setEquipmentList(response.data.equipments || []);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleCardClick = (equipmentId) => {
    navigate(`/booking/${equipmentId}`);
  };

  const handleMyEquipmentClick = () => {
    navigate("/my-equipment");
  };

  const filteredEquipment = equipmentList
    .filter((equipment) => equipment.status === "Available")
    .filter((equipment) => {
      const searchTextMatch =
        (equipment.name &&
          equipment.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (equipment.type &&
          equipment.type.toLowerCase().includes(searchText.toLowerCase()));
      return searchTextMatch;
    });

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Equipment Lending</h1>
          <h2 className={styles.heroSubtitle}>
            Explore Event Equipment Available for Reservation
          </h2>
          <p className={styles.heroText}>
            Discover the best event-related equipment for your needs. Reserve
            audio-visual gear, lighting, staging materials, and more with ease.
          </p>
          <div className={styles.heroButtons}>
            <button
              className={styles.myEquipmentButton}
              onClick={handleMyEquipmentClick}
            >
              My Equipment
            </button>
            <button className={styles.learnMoreButton}>Learn More</button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className={styles.searchSection}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by Equipment Name or Type"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </section>

      {/* Available Equipment Section */}
      <section className={styles.availableEquipmentSection}>
        <h3 className={styles.sectionTitle}>Available Equipment</h3>
        <div className={styles.equipmentGrid}>
          {filteredEquipment.length > 0 ? (
            filteredEquipment.map((equipment) => (
              <div
                key={equipment._id}
                className={styles.equipmentCard}
                onClick={() => handleCardClick(equipment._id)}
              >
                <img
                  src={
                    equipment.imageUrl
                      ? `/${equipment.imageUrl}`
                      : "/default-image.jpg"
                  }
                  alt={equipment.name}
                  className={styles.equipmentImage}
                />
                <div className={styles.equipmentContent}>
                  <p className={styles.equipmentAvailability}>
                    {equipment.status === "Available"
                      ? "Available"
                      : "Not Available"}
                  </p>
                  <h4 className={styles.equipmentName}>{equipment.name}</h4>
                  <p className={styles.equipmentType}>{equipment.type}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noEquipmentMessage}>
              No equipment available for reservation.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
