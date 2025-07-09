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
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Box,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Event as EventIcon,
  NavigateBefore,
  NavigateNext,
  CalendarMonth,
  ViewWeek,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  HelpOutline as HelpOutlineIcon,
  Keyboard as KeyboardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EventRackService from '../services/eventRackServices';
import ReservaService from '../services/reservaServices';
import Navbar from '../componentes/Navbar';
import './EventRack.css';

const EventRack = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    fechaEvento: '',
    horaInicio: '',
    horaFin: '',
    mensaje: '',
    idReserva: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [actionInProgress, setActionInProgress] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [errors, setErrors] = useState({
    fechaEvento: false,
    horaInicio: false,
    horaFin: false
  });
  const [simplifiedView, setSimplifiedView] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Obtener todos los eventos
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await EventRackService.getAllEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setSnackbar({ 
        open: true, 
        message: getErrorMessage(error), 
        severity: 'error',
        autoHideDuration: 10000
      });
    } finally {
      setLoading(false);
    }
  };

  // Obtener todas las reservas
  const fetchReservations = async () => {
    try {
      const response = await ReservaService.getAll();
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setSnackbar({ 
        open: true, 
        message: getErrorMessage(error), 
        severity: 'error',
        autoHideDuration: 10000
      });
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchReservations();
  }, [currentDate, viewMode]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        goToPrevious();
      } else if (e.key === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        goToNext();
      } else if (e.key === 't' && (e.ctrlKey || e.metaKey)) {
        goToToday();
      } else if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleOpenDialog();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDate, viewMode]);

  // Funciones de navegación del calendario
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Obtener fechas de la semana actual
  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(weekDate);
    }
    return weekDates;
  };

  // Obtener semanas del mes actual
  const getMonthWeeks = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Ajustar para comenzar en lunes
    const startDay = firstDay.getDay();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - (startDay === 0 ? 6 : startDay - 1));
    
    // Ajustar para terminar en domingo
    const endDay = lastDay.getDay();
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (endDay === 0 ? 0 : 7 - endDay));
    
    const weeks = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
    }
    
    return weeks;
  };

  // Obtener eventos para una fecha específica
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.fechaEvento === dateStr);
  };

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {
      fechaEvento: !newEvent.fechaEvento,
      horaInicio: !newEvent.horaInicio,
      horaFin: !newEvent.horaFin || 
               (newEvent.horaInicio && newEvent.horaFin <= newEvent.horaInicio)
    };
    
    setErrors(newErrors);
    
    if (newErrors.horaFin) {
      setSnackbar({
        open: true,
        message: 'La hora de fin debe ser posterior a la hora de inicio',
        severity: 'warning',
        autoHideDuration: 6000
      });
    }
    
    return !Object.values(newErrors).some(error => error);
  };

  // Manejar cambios en los campos de entrada
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
    
    // Limpiar errores al editar
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  // Abrir el diálogo de creación/edición
  const handleOpenDialog = (event = null, selectedDate = null) => {
    setCurrentEvent(event);
    if (event) {
      setNewEvent({
        fechaEvento: event.fechaEvento || '',
        horaInicio: event.horaInicio || '',
        horaFin: event.horaFin || '',
        mensaje: event.mensaje || '',
        idReserva: event.idReserva || ''
      });
    } else {
      const defaultDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
      setNewEvent({
        fechaEvento: defaultDate,
        horaInicio: '',
        horaFin: '',
        mensaje: '',
        idReserva: ''
      });
    }
    setOpenDialog(true);
  };

  // Cerrar el diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({
      fechaEvento: false,
      horaInicio: false,
      horaFin: false
    });
  };

  // Crear o actualizar un evento
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setActionInProgress(true);
      
      if (currentEvent) {
        await EventRackService.updateEvent(currentEvent.id, newEvent);
        setSnackbar({ 
          open: true, 
          message: 'Evento actualizado con éxito', 
          severity: 'success',
          autoHideDuration: 4000
        });
      } else {
        await EventRackService.createEvent(newEvent);
        setSnackbar({ 
          open: true, 
          message: 'Evento creado con éxito', 
          severity: 'success',
          autoHideDuration: 4000
        });
      }
      
      fetchEvents();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving event:', error);
      setSnackbar({ 
        open: true, 
        message: getErrorMessage(error), 
        severity: 'error',
        autoHideDuration: 10000
      });
    } finally {
      setActionInProgress(false);
    }
  };

  // Eliminar un evento
  const handleDelete = async (id) => {
    const eventToDelete = events.find(e => e.id === id);
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      try {
        await EventRackService.deleteEvent(id);
        setLastAction({ type: 'delete', data: eventToDelete });
        setSnackbar({ 
          open: true, 
          message: 'Evento eliminado con éxito', 
          severity: 'success',
          autoHideDuration: 8000,
          action: (
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => handleUndoDelete(lastAction.data)}
            >
              DESHACER
            </Button>
          )
        });
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        setSnackbar({ 
          open: true, 
          message: getErrorMessage(error), 
          severity: 'error',
          autoHideDuration: 10000
        });
      }
    }
  };

  // Deshacer eliminación
  const handleUndoDelete = async (eventData) => {
    try {
      await EventRackService.createEvent(eventData);
      setSnackbar({ 
        open: true, 
        message: 'Evento restaurado con éxito', 
        severity: 'success',
        autoHideDuration: 4000
      });
      fetchEvents();
    } catch (error) {
      console.error('Error undoing delete:', error);
      setSnackbar({ 
        open: true, 
        message: getErrorMessage(error), 
        severity: 'error',
        autoHideDuration: 10000
      });
    }
  };

    // Crear evento desde reserva
  // EventRack.jsx
  const handleCreateFromReservation = async (reservationId) => {
    try {
      setActionInProgress(true);
      
      // Verificar primero si ya existe un evento para esta reserva
      const existingEvents = events.filter(event => event.idReserva === reservationId);
      if (existingEvents.length > 0) {
        setSnackbar({ 
          open: true, 
          message: 'Ya existe un evento creado para esta reserva', 
          severity: 'warning',
          autoHideDuration: 6000
        });
        return;
      }

      await EventRackService.createEventFromReservation(reservationId);
      setSnackbar({ 
        open: true, 
        message: 'Evento creado desde reserva con éxito', 
        severity: 'success',
        autoHideDuration: 4000
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event from reservation:', error);
      setSnackbar({ 
        open: true, 
        message: error.message || getErrorMessage(error), 
        severity: 'error',
        autoHideDuration: 10000
      });
    } finally {
      setActionInProgress(false);
    }
  };

  // Cerrar el snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Formatear fecha para mostrar
  const formatDate = (date) => {
    return date.toLocaleDateString('es-CL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  // Formatear hora para mostrar
  const formatTime = (time) => {
    return time ? time.substring(0, 5) : '';
  };

  // Obtener mensaje de error amigable
  const getErrorMessage = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400: return 'Datos inválidos. Verifica la información ingresada.';
        case 401: return 'No autorizado. Debes iniciar sesión.';
        case 404: return 'Recurso no encontrado.';
        case 500: return 'Error interno del servidor. Intenta nuevamente más tarde.';
        default: return 'Ocurrió un error inesperado.';
      }
    } else if (error.request) {
      return 'No se recibió respuesta del servidor. Verifica tu conexión a internet.';
    } else {
      return 'Error al realizar la solicitud.';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="loading-container">
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Cargando calendario de eventos...
        </Typography>
      </Container>
    );
  }

  return (
    <div className={`event-rack-container ${simplifiedView ? 'simplified-view' : ''}`}>
      <Navbar />
      
      {/* Hero Section */}
      <div className="event-hero">
        <Typography variant="h2" component="h1" className="hero-title">
          CALENDARIO DE EVENTOS
        </Typography>
        <Typography variant="h5" className="hero-subtitle">
          Organiza y gestiona todos los eventos del rack
        </Typography>
      </div>

      <Container maxWidth="lg" className="main-content">
        {/* Controles del calendario */}
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="week">
                <ViewWeek sx={{ mr: 1 }} />
                Semana
              </ToggleButton>
              <ToggleButton value="month">
                <CalendarMonth sx={{ mr: 1 }} />
                Mes
              </ToggleButton>
            </ToggleButtonGroup>
            
            <Button 
              onClick={goToToday} 
              variant="outlined" 
              size="small"
              className="secondary-button"
            >
              Hoy
            </Button>

            <FormControlLabel
              control={
                <Switch
                  checked={simplifiedView}
                  onChange={() => setSimplifiedView(!simplifiedView)}
                  color="primary"
                  size="small"
                />
              }
              label="Vista simplificada"
              sx={{ ml: 1 ,color: '#0d47a1', fontWeight: 'bold' }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Semana/Mes anterior (Ctrl+←)">
              <IconButton onClick={goToPrevious}>
                <NavigateBefore />
              </IconButton>
            </Tooltip>
            
            <Typography variant="h6" sx={{ 
              color: '#0d47a1', 
              minWidth: 200, 
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {viewMode === 'week' 
                ? `Semana del ${formatDate(getWeekDates(currentDate)[0])}`
                : currentDate.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }).toUpperCase()
              }
            </Typography>
            
            <Tooltip title="Semana/Mes siguiente (Ctrl+→)">
              <IconButton onClick={goToNext}>
                <NavigateNext />
              </IconButton>
            </Tooltip>
          </Box>

          <Tooltip title="Crear nuevo evento (Ctrl+N)">
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />} 
              onClick={() => handleOpenDialog()}
              className="primary-button"
            >
              Nuevo Evento
            </Button>
          </Tooltip>
        </Box>

        {/* Lista de reservas para crear eventos */}
        {reservations.length > 0 && (
          <Card sx={{ mb: 3 }} className={simplifiedView ? 'simplified-card' : 'reservations-card'}>
            <CardContent>
              <Typography variant="h6" gutterBottom className="section-title">
                <EventIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Crear Eventos desde Reservas
              </Typography>
              <Grid container spacing={2}>
                {reservations.map(reservation => {
                  const hasEvent = events.some(event => event.idReserva === reservation.id);
                  return (
                    <Grid item key={reservation.id}>
                      <Tooltip title={hasEvent ? "Ya existe un evento para esta reserva" : "Crear evento desde esta reserva"} arrow>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleCreateFromReservation(reservation.id)}
                          startIcon={<EventIcon />}
                          className="reservation-button"
                          disabled={actionInProgress || hasEvent}
                          sx={{
                            backgroundColor: hasEvent ? '#e0e0e0' : 'inherit',
                            '&:hover': {
                              backgroundColor: hasEvent ? '#e0e0e0' : 'rgba(25, 118, 210, 0.04)'
                            }
                          }}
                        >
                          Reserva #{reservation.id}
                          {hasEvent && <CheckIcon fontSize="small" sx={{ ml: 1 }} />}
                        </Button>
                      </Tooltip>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Sección de ayuda rápida */}
        <Card sx={{ mb: 3 }} className={simplifiedView ? 'simplified-card' : ''}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <HelpOutlineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Ayuda rápida
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AddIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">Haz clic en un día/hora para crear evento</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EditIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">Haz clic en un evento para editarlo</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">Convierte reservas en eventos con un clic</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Vista del calendario */}
        {viewMode === 'week' ? (
          <TableContainer 
            component={Paper} 
            className={simplifiedView ? 'simplified-table' : 'events-table'}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hora</TableCell>
                  {getWeekDates(currentDate).map((date, index) => (
                    <TableCell key={index} align="center">
                      <Box className="day-header">
                        <Typography variant="body2" color="textSecondary">
                          {date.toLocaleDateString('es-CL', { weekday: 'short' }).toUpperCase()}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {date.getDate()}
                        </Typography>
                        <Tooltip title="Agregar evento">
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenDialog(null, date)}
                            className="add-event-button"
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 24 }, (_, hour) => (
                  <TableRow key={hour}>
                    <TableCell className="hour-cell">
                      {`${hour.toString().padStart(2, '0')}:00`}
                    </TableCell>
                    {getWeekDates(currentDate).map((date, dateIndex) => {
                      const dayEvents = getEventsForDate(date).filter(event => 
                        parseInt(event.horaInicio.split(':')[0]) === hour
                      );
                      
                      return (
                        <TableCell key={dateIndex} className="event-cell">
                          {dayEvents.map(event => (
                            <Card key={event.id} className="event-card">
                              <CardContent>
                                <Typography variant="body2" fontWeight="bold">
                                  {formatTime(event.horaInicio)} - {formatTime(event.horaFin)}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  {event.mensaje}
                                </Typography>
                                {event.idReserva && (
                                  <Chip 
                                    label={`Reserva #${event.idReserva}`}
                                    size="small"
                                    className="reservation-chip"
                                  />
                                )}
                                <Box className="event-actions">
                                  <Tooltip title="Editar evento">
                                    <IconButton 
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenDialog(event);
                                      }}
                                      className="edit-button"
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Eliminar evento">
                                    <IconButton 
                                      size="small"
                                      color="error"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(event.id);
                                      }}
                                      className="delete-button"
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box className={`month-view-container ${simplifiedView ? 'simplified-card' : ''}`}>
            <Grid container spacing={1} className="month-grid">
              {/* Encabezados de días */}
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                <Grid item xs key={day} className="month-day-header">
                  <Typography variant="subtitle2" align="center" fontWeight="bold">
                    {day}
                  </Typography>
                </Grid>
              ))}
              
              {/* Días del mes */}
              {getMonthWeeks(currentDate).map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {week.map((date, dayIndex) => {
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dayEvents = getEventsForDate(date);
                    
                    return (
                      <Grid item xs key={`${weekIndex}-${dayIndex}`} className="month-day-cell">
                        <Card 
                          className={`month-day-card ${isCurrentMonth ? '' : 'other-month'} ${isToday ? 'today' : ''}`}
                          onClick={() => handleOpenDialog(null, date)}
                        >
                          <CardContent className="month-day-content">
                            <Typography 
                              variant="body2" 
                              className={`month-day-number ${isToday ? 'today-number' : ''}`}
                            >
                              {date.getDate()}
                            </Typography>
                            
                            <Box className="month-day-events">
                              {dayEvents.slice(0, 2).map(event => (
                                <Box 
                                  key={event.id} 
                                  className="month-event-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDialog(event);
                                  }}
                                >
                                  <Typography variant="caption">
                                    {formatTime(event.horaInicio)} {event.mensaje}
                                  </Typography>
                                </Box>
                              ))}
                              {dayEvents.length > 2 && (
                                <Typography variant="caption" className="more-events">
                                  +{dayEvents.length - 2} más
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </React.Fragment>
              ))}
            </Grid>
          </Box>
        )}

        {/* CTA Section */}
        <Box className={`cta-section ${simplifiedView ? 'simplified-card' : ''}`} textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h4" className="cta-title">
            Volver a la página de inicio
          </Typography>
          <Typography variant="subtitle1" className="cta-subtitle">
            Presiona el botón de abajo para regresar a la página principal.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowIcon />}
            className="contact-button"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Home
          </Button>
        </Box>
      </Container>

      {/* Diálogo de creación/edición */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle className="dialog-title">
          {currentEvent ? `Editando evento del ${formatDate(new Date(currentEvent.fechaEvento))}` : 'Planificar nuevo evento'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" className="dialog-subtitle">
            {currentEvent ? 'Modifica los detalles del evento' : 'Completa la información para crear un nuevo evento'}
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Fecha *"
                name="fechaEvento"
                type="date"
                value={newEvent.fechaEvento}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                className="form-field"
                error={errors.fechaEvento}
                helperText={errors.fechaEvento ? 'La fecha es requerida' : ''}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                label="Hora Inicio *"
                name="horaInicio"
                type="time"
                value={newEvent.horaInicio}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                className="form-field"
                error={errors.horaInicio}
                helperText={errors.horaInicio ? 'La hora de inicio es requerida' : ''}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Hora Fin *"
                name="horaFin"
                type="time"
                value={newEvent.horaFin}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                className="form-field"
                error={errors.horaFin}
                helperText={errors.horaFin ? 'La hora de fin debe ser posterior a la de inicio' : ''}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Mensaje/Descripción"
                name="mensaje"
                value={newEvent.mensaje}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                helperText="Descripción o notas del evento"
                className="form-field"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            className="secondary-button"
            disabled={actionInProgress}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary" 
            className="primary-button"
            disabled={actionInProgress}
          >
            {actionInProgress ? (
              <CircularProgress size={24} color="inherit" />
            ) : currentEvent ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={snackbar.autoHideDuration || 6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          className="snackbar-alert"
          action={snackbar.action}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Botón de ayuda flotante */}
      <Button 
        startIcon={<HelpOutlineIcon />}
        onClick={() => setHelpOpen(true)}
        sx={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20,
          borderRadius: '50%',
          minWidth: 'auto',
          width: '56px',
          height: '56px',
          padding: 0
        }}
        variant="contained"
        color="primary"
        className="help-button"
      >
        <HelpOutlineIcon />
      </Button>

      {/* Diálogo de ayuda */}
      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <HelpOutlineIcon color="primary" sx={{ mr: 1 }} />
            Ayuda de EventRack
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>Guía rápida</Typography>
          <Typography paragraph>
            El calendario EventRack te permite gestionar todos los eventos del rack de forma visual.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Vista Semanal</Typography>
          <Typography paragraph>
            - Cada columna representa un día de la semana<br />
            - Cada fila representa una hora del día<br />
            - Haz clic en cualquier celda para agregar un evento<br />
            - Haz clic en un evento existente para editarlo o eliminarlo
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Vista Mensual</Typography>
          <Typography paragraph>
            - Visualiza todos los eventos del mes en un vistazo<br />
            - Los días fuera del mes actual aparecen sombreados<br />
            - El día actual se resalta con un borde azul
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Atajos de teclado</Typography>
          <Typography paragraph>
            - <strong>Ctrl + ←</strong>: Semana/mes anterior<br />
            - <strong>Ctrl + →</strong>: Semana/mes siguiente<br />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setHelpOpen(false)} 
            color="primary"
            className="primary-button"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventRack;