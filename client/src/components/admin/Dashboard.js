import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/cards";
import { Users, Calendar, MapPin, BarChart, PieChart } from 'lucide-react';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [reservationsData, setReservationsData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const reservationsResponse = await axios.get('/api/reservations/all');
      const equipmentResponse = await axios.get('/api/equipment/getEquipment');
      setReservationsData(reservationsResponse.data);
      setEquipmentData(equipmentResponse.data.equipment);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const getReservationsByDate = () => {
    const reservationsByDate = reservationsData.reduce((acc, reservation) => {
      const date = format(new Date(reservation.createdAt), 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(reservationsByDate).map(([date, count]) => ({ date, count }));
  };

  const getEquipmentByLocation = () => {
    return equipmentData.reduce((acc, equipment) => {
      acc[equipment.location] = (acc[equipment.location] || 0) + 1;
      return acc;
    }, {});
  };

  const equipmentLocationData = Object.entries(getEquipmentByLocation());

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <h1 className={styles.dashboardTitle}>Analytics Dashboard</h1>

        {/* Summary Cards */}
        <div className={styles.summaryCardsGrid}>
          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Total Reservations</CardTitle>
              <Users className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>{reservationsData.length}</div>
            </CardContent>
          </Card>

          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Total Equipment</CardTitle>
              <Calendar className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>{equipmentData.length}</div>
            </CardContent>
          </Card>

          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Next Available Equipment</CardTitle>
              <Calendar className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>
                {equipmentData.length > 0
                  ? format(new Date(Math.min(...equipmentData.map(e => new Date(e.availableDate)))), 'MMM d, yyyy')
                  : 'No available equipment'}
              </div>
            </CardContent>
          </Card>

          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Popular Location</CardTitle>
              <MapPin className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>
                {equipmentLocationData.length > 0
                  ? equipmentLocationData.reduce((a, b) => a[1] > b[1] ? a : b)[0]
                  : 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className={styles.chartsGrid}>
          <Card className={styles.chartCard}>
            <CardHeader>
              <CardTitle className={styles.chartTitle}>
                <BarChart className={styles.chartIcon} />
                Reservations Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.chartContent}>
                {getReservationsByDate().slice(-5).map(({ date, count }) => (
                  <div key={date} className={styles.chartRow}>
                    <div className={styles.chartDate}>{date}</div>
                    <div className={styles.chartBarContainer}>
                      <div
                        className={styles.chartBar}
                        style={{ width: `${(count / Math.max(...getReservationsByDate().map(b => b.count))) * 100}%` }}
                      ></div>
                    </div>
                    <div className={styles.chartCount}>{count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={styles.chartCard}>
            <CardHeader>
              <CardTitle className={styles.chartTitle}>
                <PieChart className={styles.chartIcon} />
                Equipment by Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.chartContent}>
                {equipmentLocationData.map(([location, count]) => (
                  <div key={location} className={styles.chartRow}>
                    <div className={styles.chartLocation}>{location}</div>
                    <div className={styles.chartBarContainer}>
                      <div
                        className={styles.chartBar}
                        style={{ width: `${(count / Math.max(...equipmentLocationData.map(e => e[1]))) * 100}%` }}
                      ></div>
                    </div>
                    <div className={styles.chartCount}>{count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;