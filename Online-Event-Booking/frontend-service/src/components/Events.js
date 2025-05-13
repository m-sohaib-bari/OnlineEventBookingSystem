import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [bookingError, setBookingError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://oebs.local/events");
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch events");
      setLoading(false);
    }
  };

  const handleBookClick = (event) => {
    setSelectedEvent(event);
    setTickets(1);
    setBookingError("");
  };

  const handleClose = () => {
    setSelectedEvent(null);
    setBookingError("");
  };

  const handleBooking = async () => {
    if (!user) {
      setBookingError("Please login to book events");
      return;
    }

    try {
      await axios.post("http://oebs.local/bookings/create", {
        userId: user.id,
        eventId: selectedEvent.id,
        tickets: tickets,
      });
      handleClose();
      fetchEvents(); // Refresh events to update availability
    } catch (err) {
      setBookingError(err.response?.data?.error || "Failed to book event");
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading events...</Typography>
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
        Available Events
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {event.name}
                </Typography>
                <Typography color="textSecondary">
                  Date: {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography>
                  Available Tickets: {event.availableTickets}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleBookClick(event)}
                  disabled={event.availableTickets === 0}
                >
                  Book Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selectedEvent} onClose={handleClose}>
        <DialogTitle>Book Event</DialogTitle>
        <DialogContent>
          {bookingError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {bookingError}
            </Alert>
          )}
          <Typography variant="subtitle1" gutterBottom>
            {selectedEvent?.name}
          </Typography>
          <TextField
            type="number"
            label="Number of Tickets"
            value={tickets}
            onChange={(e) => setTickets(parseInt(e.target.value))}
            inputProps={{ min: 1, max: selectedEvent?.availableTickets }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleBooking} color="primary">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Events;
