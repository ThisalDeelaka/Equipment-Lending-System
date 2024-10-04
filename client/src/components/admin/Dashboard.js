import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/cards";
import { Users, Ticket, Calendar, MapPin, BarChart, PieChart } from 'lucide-react';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [bookingsData, setBookingsData] = useState([]);
  const [ticketsData, setTicketsData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bookingsResponse = await axios.get('/api/bookings/all');
      const ticketsResponse = await axios.get('/api/tickets/getTickets');
      setBookingsData(bookingsResponse.data);
      setTicketsData(ticketsResponse.data.tickets);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const getBookingsByDate = () => {
    const bookingsByDate = bookingsData.reduce((acc, booking) => {
      const date = format(new Date(booking.createdAt), 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(bookingsByDate).map(([date, count]) => ({ date, count }));
  };

  const getTicketsByLocation = () => {
    return ticketsData.reduce((acc, ticket) => {
      acc[ticket.location] = (acc[ticket.location] || 0) + 1;
      return acc;
    }, {});
  };

  const ticketLocationData = Object.entries(getTicketsByLocation());

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <h1 className={styles.dashboardTitle}>Analytics Dashboard</h1>

        {/* Summary Cards */}
        <div className={styles.summaryCardsGrid}>
          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Total Bookings</CardTitle>
              <Users className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>{bookingsData.length}</div>
            </CardContent>
          </Card>

          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Total Tickets</CardTitle>
              <Ticket className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>{ticketsData.length}</div>
            </CardContent>
          </Card>

          <Card className={styles.summaryCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Next Event</CardTitle>
              <Calendar className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardValue}>
                {ticketsData.length > 0
                  ? format(new Date(Math.min(...ticketsData.map(t => new Date(t.date)))), 'MMM d, yyyy')
                  : 'No upcoming events'}
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
                {ticketLocationData.length > 0
                  ? ticketLocationData.reduce((a, b) => a[1] > b[1] ? a : b)[0]
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
                Bookings Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.chartContent}>
                {getBookingsByDate().slice(-5).map(({ date, count }) => (
                  <div key={date} className={styles.chartRow}>
                    <div className={styles.chartDate}>{date}</div>
                    <div className={styles.chartBarContainer}>
                      <div
                        className={styles.chartBar}
                        style={{ width: `${(count / Math.max(...getBookingsByDate().map(b => b.count))) * 100}%` }}
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
                Tickets by Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.chartContent}>
                {ticketLocationData.map(([location, count]) => (
                  <div key={location} className={styles.chartRow}>
                    <div className={styles.chartLocation}>{location}</div>
                    <div className={styles.chartBarContainer}>
                      <div
                        className={styles.chartBar}
                        style={{ width: `${(count / Math.max(...ticketLocationData.map(t => t[1]))) * 100}%` }}
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