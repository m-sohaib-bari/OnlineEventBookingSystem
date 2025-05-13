import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Events from './components/Events';
import Bookings from './components/Bookings';
import EventManagement from './components/EventManagement';
import { AuthProvider, useAuth } from './context/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/events"
                  element={
                    <PrivateRoute>
                      <Events />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <PrivateRoute>
                      <Bookings />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/manage-events"
                  element={
                    <PrivateRoute>
                      <EventManagement />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/events" replace />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 