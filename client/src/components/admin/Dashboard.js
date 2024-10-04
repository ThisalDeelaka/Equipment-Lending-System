import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/cards";
import { Settings, Calendar, BarChart, CheckCircle, FileText } from 'lucide-react';
import styles from './Dashboard.module.css';

function AdminDashboard() {
  const [reservationsData, setReservationsData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [checkInOutData, setCheckInOutData] = useState([]);
  const [reportsData, setReportsData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const reservationsResponse = await axios.get('/api/reservations/all');
      const equipmentResponse = await axios.get('/api/equipment/getAll');
      const checkInOutResponse = await axios.get('/api/equipment/checkInOut');
      const reportsResponse = await axios.get('/api/reports/getAll');
      
      setReservationsData(reservationsResponse.data);
      setEquipmentData(equipmentResponse.data.equipment);
      setCheckInOutData(checkInOutResponse.data);
      setReportsData(reportsResponse.data);
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

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className={styles.summaryCardsGrid}>
          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Total Reservations</CardTitle>
              <Calendar className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>{reservationsData.length}</div>
            </CardContent>
          </Card>

          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Total Equipment</CardTitle>
              <Settings className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>{equipmentData.length}</div>
            </CardContent>
          </Card>

          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Next Available Equipment</CardTitle>
              <CheckCircle className={styles.cardIcon} />
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
              <CardTitle className={styles.cardTitle}>Recent Check-Ins/Check-Outs</CardTitle>
              <FileText className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>{checkInOutData.length}</div>
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
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
