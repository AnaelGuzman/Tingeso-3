import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import reservaService from '../services/reservaServices';
import Navbar from '../componentes/Navbar';

// Utilidades para formato de fecha y hora
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString('es-ES', options);
  } catch (e) {
    console.error('Error formateando fecha:', e);
    return 'N/A';
  }
};

const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  
  try {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  } catch (e) {
    console.error('Error formateando hora:', e);
    return 'N/A';
  }
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$0';
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
};

const ReservasAdmin = () => {
  // Estados principales
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para feedback
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Cargar datos iniciales
  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reservaService.getAll();
      setReservas(response.data);
    } catch (err) {
      console.error('Error fetching reservas:', err);
      setError('Error al cargar las reservas. Por favor, intenta nuevamente.');
      showSnackbar('Error al cargar las reservas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const reserva = reservas.find(r => r.id === id);
    if (window.confirm(`¿Estás seguro de eliminar la reserva del ${formatDate(reserva.fechaReserva)}?`)) {
      try {
        await reservaService.deleteById(id);
        showSnackbar('Reserva eliminada correctamente', 'success');
        fetchReservas();
      } catch (err) {
        showSnackbar('Error al eliminar reserva', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" className="usuarios-container">
      <Navbar/>
      <Typography variant="h3" component="h1" gutterBottom className="page-title">
        Administración de Reservas
      </Typography>

      {/* Información de estado */}
      {reservas.length === 0 && !loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No hay reservas registradas.
        </Alert>
      )}

      {/* Tabla de reservas */}
      {loading ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando reservas...
          </Typography>
        </Paper>
      ) : error ? (
        <Alert severity="error" className="error-alert">
          {error}
        </Alert>
      ) : (
        <TableContainer component={Paper} className="table-container" elevation={3}>
          <Table aria-label="Tabla de reservas" stickyHeader>
            <TableHead>
              <TableRow className="table-header">
                <TableCell>Fecha</TableCell>
                <TableCell>Horario</TableCell>
                <TableCell>Tarifa Escogida</TableCell>
                <TableCell>Valores</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservas.map((reserva) => (
                <TableRow key={reserva.id} hover className="table-row">
                  <TableCell>
                    <div className="user-info">
                      <EventIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        {formatDate(reserva.fechaReserva)}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      <ScheduleIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {formatTime(reserva.horaInicioReserva)} - {formatTime(reserva.horaFinReserva)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={reserva.tarifaEscogida} 
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      <MoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Neto: {formatCurrency(reserva.precioNeto)}
                    </Typography>
                    <Typography variant="body2">
                      <ReceiptIcon fontSize="small" sx={{ mr: 0.5 }} />
                      IVA: {formatCurrency(reserva.precioIva)}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      Total: {formatCurrency(reserva.valorFinal)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Eliminar reserva">
                      <IconButton
                        onClick={() => handleDelete(reserva.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReservasAdmin;