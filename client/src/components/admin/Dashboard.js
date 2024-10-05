import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/cards";
import { Calendar, Settings, CheckCircle, FileText } from 'lucide-react';
import styles from './Dashboard.module.css';

function AdminDashboard() {
  const [reservationsCount, setReservationsCount] = useState(0); // To store total reservations count
  const [equipmentCount, setEquipmentCount] = useState(0); // To store total equipment count

  useEffect(() => {
    fetchData(); // Fetch data when component loads
  }, []);

  const fetchData = async () => {
    try {
      // Fetch reservations data and count objects
      const reservationsResponse = await axios.get('/api/bookings/all');
      setReservationsCount(reservationsResponse.data.length); // Set total reservations count

      // Fetch equipment data and count objects
      const equipmentResponse = await axios.get('/api/equipment/getEquipment');
      setEquipmentCount(equipmentResponse.data.equipment.length); // Count the equipment objects and set the count
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className={styles.summaryCardsGrid}>
          {/* Total Reservations Card */}
          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Total Reservations</CardTitle>
              <Calendar className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>{reservationsCount}</div> {/* Display total reservations */}
            </CardContent>
          </Card>

          {/* Total Equipment Card */}
          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Total Equipment</CardTitle>
              <Settings className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>{equipmentCount}</div> {/* Display total equipment count */}
            </CardContent>
          </Card>

          {/* Next Available Equipment (Dummy Data) */}
          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Next Available Equipment</CardTitle>
              <CheckCircle className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>Oct 20, 2024</div> {/* Dummy data */}
            </CardContent>
          </Card>

          {/* Recent Check-Ins/Check-Outs (Dummy Data) */}
          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Recent Check-Ins/Check-Outs</CardTitle>
              <FileText className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>15</div> {/* Dummy data */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
