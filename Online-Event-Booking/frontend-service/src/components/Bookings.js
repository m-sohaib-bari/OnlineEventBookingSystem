import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchEventDetails = async (eventId) => {
    try {
      const response = await axios.get(`http://oebs.local/events/${eventId}`);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new Error("Event not found");
    } catch (err) {
      console.error(`Failed to fetch event details for event ${eventId}:`, err);
      return null;
    }
  };

  const fetchBookings = async () => {
    try {
      // First, fetch all bookings for the user
      const bookingsResponse = await axios.get(
        `http://oebs.local/bookings/${user.id}`
      );
      if (bookingsResponse.status !== 200) {
        throw new Error("Failed to fetch bookings");
      }

      const bookingsData = bookingsResponse.data;

      // Then, fetch event details for each booking
      const bookingsWithEvents = await Promise.all(
        bookingsData.map(async (booking) => {
          try {
            const eventDetails = await fetchEventDetails(booking.event_id);
            return {
              ...booking,
              eventName: eventDetails?.name || `Event ID: ${booking.event_id}`,
            };
          } catch (err) {
            console.error(`Error fetching event ${booking.event_id}:`, err);
            return {
              ...booking,
              eventName: `Event ID: ${booking.event_id}`,
            };
          }
        })
      );

      setBookings(bookingsWithEvents);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert severity="info">Please login to view your bookings</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>
      {bookings.length === 0 ? (
        <Alert severity="info">You have no bookings yet</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event Name</TableCell>
                <TableCell>Tickets</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Booking ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.eventName}</TableCell>
                  <TableCell>{booking.tickets}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>{booking.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Bookings;
