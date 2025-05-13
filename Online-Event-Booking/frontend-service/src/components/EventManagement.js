import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    availableTickets: "",
    totalTickets: "",
    price: "",
    organizerName: "",
    organizerContact: "",
    category: "",
    venue: "",
    city: "",
    description: "",
    status: "UPCOMING",
  });

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

  const handleOpenDialog = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        id: event.id,
        name: event.name,
        date: new Date(event.date).toISOString().split("T")[0],
        availableTickets: event.availableTickets,
        totalTickets: event.totalTickets,
        price: event.price,
        organizerName: event.organizerName,
        organizerContact: event.organizerContact,
        category: event.category,
        venue: event.venue,
        city: event.city,
        description: event.description || "",
        status: event.status,
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        name: "",
        date: "",
        availableTickets: "",
        totalTickets: "",
        price: "",
        organizerName: "",
        organizerContact: "",
        category: "",
        venue: "",
        city: "",
        description: "",
        status: "UPCOMING",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setFormData({
      name: "",
      date: "",
      availableTickets: "",
      totalTickets: "",
      price: "",
      organizerName: "",
      organizerContact: "",
      category: "",
      venue: "",
      city: "",
      description: "",
      status: "UPCOMING",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the date to include time (midnight)
      const formattedDate = `${formData.date}T00:00:00`;

      const eventData = {
        name: formData.name,
        date: formattedDate,
        availableTickets: parseInt(formData.availableTickets),
        totalTickets: parseInt(formData.totalTickets),
        price: parseFloat(formData.price),
        organizerName: formData.organizerName,
        organizerContact: formData.organizerContact,
        category: formData.category,
        venue: formData.venue,
        city: formData.city,
        description: formData.description || "",
        status: formData.status,
      };

      console.log("Sending event data:", eventData); // Debug log

      if (selectedEvent) {
        const response = await axios.put(
          `http://oebs.local/events/update/${selectedEvent.id}`,
          eventData
        );
        if (response.status !== 200) {
          throw new Error("Failed to update event");
        }
      } else {
        const response = await axios.post(
          "http://oebs.local/events/create",
          eventData
        );
        if (response.status !== 201) {
          throw new Error("Failed to create event");
        }
      }
      handleCloseDialog();
      fetchEvents();
    } catch (err) {
      console.error("Event save error:", err);
      console.error("Error response:", err.response?.data); // Debug log
      setError(
        err.response?.data?.message || err.message || "Failed to save event"
      );
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://oebs.local/events/remove/${eventId}`);
        fetchEvents();
      } catch (err) {
        setError("Failed to delete event");
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Event Management
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ mb: 3 }}
      >
        Create New Event
      </Button>

      <Grid container spacing={3}>
        {Array.isArray(events) && events.map((event) => (
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
                <Typography>Price: ${event.price}</Typography>
                <Typography>
                  Venue: {event.venue}, {event.city}
                </Typography>
                {event.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {event.description}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenDialog(event)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(event.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedEvent ? "Edit Event" : "Create New Event"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Event Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Total Tickets"
              type="number"
              value={formData.totalTickets}
              onChange={(e) =>
                setFormData({ ...formData, totalTickets: e.target.value })
              }
              margin="normal"
              required
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              label="Available Tickets"
              type="number"
              value={formData.availableTickets}
              onChange={(e) =>
                setFormData({ ...formData, availableTickets: e.target.value })
              }
              margin="normal"
              required
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              margin="normal"
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              label="Organizer Name"
              value={formData.organizerName}
              onChange={(e) =>
                setFormData({ ...formData, organizerName: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Organizer Contact"
              value={formData.organizerContact}
              onChange={(e) =>
                setFormData({ ...formData, organizerContact: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Venue"
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              margin="normal"
              required
            />
            {selectedEvent && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  label="Status"
                >
                  <MenuItem value="UPCOMING">Upcoming</MenuItem>
                  <MenuItem value="ONGOING">Ongoing</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
              </FormControl>
            )}
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedEvent ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default EventManagement;
