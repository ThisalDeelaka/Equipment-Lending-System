import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/cards';
import { Calendar, BarChart, Settings } from 'lucide-react';
import styles from './Dashboard.module.css';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalReservations: 0,
    totalEquipment: 0,
    reservationsOverTime: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/data');
      setDashboardData({
        totalReservations: response.data.totalReservations,
        totalEquipment: response.data.totalEquipment,
        reservationsOverTime: getReservationsByDate(response.data.reservations),
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    }
  };

  // Process reservations to group them by date
  const getReservationsByDate = (reservations) => {
    const reservationsByDate = reservations.reduce((acc, reservation) => {
      const date = format(new Date(reservation.reservationDate), 'yyyy-MM-dd');
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
              <div className={styles.cardValue}>{dashboardData.totalReservations}</div>
            </CardContent>
          </Card>

          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Total Equipment</CardTitle>
              <Settings className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>{dashboardData.totalEquipment}</div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations Over Time (Chart) */}
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
                {dashboardData.reservationsOverTime.slice(-5).map(({ date, count }) => (
                  <div key={date} className={styles.chartRow}>
                    <div className={styles.chartDate}>{date}</div>
                    <div className={styles.chartBarContainer}>
                      <div
                        className={styles.chartBar}
                        style={{
                          width: `${(count / Math.max(...dashboardData.reservationsOverTime.map(b => b.count))) * 100}%`,
                        }}
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
