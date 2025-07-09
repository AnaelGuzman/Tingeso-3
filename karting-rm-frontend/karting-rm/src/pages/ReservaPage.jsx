import React, { useState, useEffect } from 'react';
import { 
  Container,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Box,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { 
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  LocalOffer as TarifaIcon,
  Search as SearchIcon,
  PersonAdd as AddIcon,
  Clear as ClearIcon,
  CheckCircle as CheckIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';
import reservaService from '../services/reservaServices';
import tarifasService from '../services/tarifaServices';
import tarifasEspecialesService from '../services/tarifaEspecialesServices';
import usuariosService from '../services/usuariosServices';
import descuentoFrecuenciaServices from '../services/descuentoFrecuenciaServices';
import descuentoGrupalServices from '../services/descuentoGrupalServices';
import Navbar from '../componentes/Navbar';
import './Reserva.css';

const Paso1Tarifa = ({ onNext }) => {
  const [tarifasRegulares, setTarifasRegulares] = useState([]);
  const [tarifasEspeciales, setTarifasEspeciales] = useState([]);
  const [selectedTarifa, setSelectedTarifa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const [regulares, especiales] = await Promise.all([
          tarifasService.getAll(),
          tarifasEspecialesService.getAll()
        ]);
        
        setTarifasRegulares(regulares.data);
        setTarifasEspeciales(especiales.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las tarifas');
        setLoading(false);
      }
    };

    fetchTarifas();
  }, []);

  const handleTarifaChange = (event) => {
    setSelectedTarifa(event.target.value);
    setTouched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedTarifa) {
      setTouched(true);
      return;
    }
    
    const [tipo, id] = selectedTarifa.split('|');
    onNext({ 
      tarifa: { tipo, id },
      tarifaSeleccionada: tipo === 'regular' 
        ? tarifasRegulares.find(t => t.id == id)
        : tarifasEspeciales.find(t => t.id == id)
    });
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Cargando tarifas...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
        Selecciona una tarifa
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
            Tarifas Regulares
          </FormLabel>
          <RadioGroup 
            aria-label="tarifas-regulares" 
            name="tarifas-regulares"
            value={selectedTarifa}
            onChange={handleTarifaChange}
          >
            {tarifasRegulares.map((tarifa) => (
              <Paper key={`regular|${tarifa.id}`} elevation={1} sx={{ p: 2, mb: 1 }}>
                <FormControlLabel 
                  value={`regular|${tarifa.id}`}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">{tarifa.nombre}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tarifa.vueltas} o máximo {tarifa.tiempo}
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        ${tarifa.preciosRegulares.toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            ))}
          </RadioGroup>
        </FormControl>

        {tarifasEspeciales.length > 0 && (
          <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
              Tarifas Especiales
            </FormLabel>
            <RadioGroup 
              aria-label="tarifas-especiales" 
              name="tarifas-especiales"
              value={selectedTarifa}
              onChange={handleTarifaChange}
            >
              {tarifasEspeciales.map((tarifa) => (
                <Paper key={`especial|${tarifa.id}`} elevation={1} sx={{ p: 2, mb: 1 }}>
                  <FormControlLabel 
                    value={`especial|${tarifa.id}`}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">{tarifa.nombre}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {tarifa.vueltas} o máximo {tarifa.tiempo}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Válido: {tarifa.dia}/{tarifa.mes}
                          </Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="bold">
                          ${tarifa.preciosRegulares.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
              ))}
            </RadioGroup>
          </FormControl>
        )}

        {touched && !selectedTarifa && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Por favor selecciona una tarifa para continuar
          </Alert>
        )}

        <Box display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<NextIcon />}
            disabled={!selectedTarifa}
            sx={{ minWidth: 150 }}
          >
            Continuar
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

const Paso2Horario = ({ onNext, onBack, tarifaSeleccionada, initialValues }) => {
  const [formData, setFormData] = useState({
    fechaReserva: initialValues.fechaReserva || '',
    horaInicioReserva: initialValues.horaInicioReserva || '',
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const duracionMinutos = parseInt(tarifaSeleccionada.duracionTotal || tarifaSeleccionada.duracion);

  const calcularHoraFin = (horaInicio) => {
    if (!horaInicio) return '';
    
    const [horaStr, minutoStr] = horaInicio.split(':');
    let hora = parseInt(horaStr);
    let minuto = parseInt(minutoStr);
    
    minuto += duracionMinutos;
    while (minuto >= 60) {
      hora += 1;
      minuto -= 60;
    }
    
    const selectedDate = formData.fechaReserva ? new Date(formData.fechaReserva) : null;
    const isWeekend = selectedDate ? [0, 6].includes(selectedDate.getDay()) : false;
    const horaCierre = isWeekend ? 22 : 22;
    
    if (hora > horaCierre || (hora === horaCierre && minuto > 0)) {
      hora = horaCierre;
      minuto = 0;
    }
    
    return `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
  };

  const horaFinReserva = calcularHoraFin(formData.horaInicioReserva);

  useEffect(() => {
    const newErrors = {};
    const selectedDate = formData.fechaReserva ? new Date(formData.fechaReserva) : null;
    const isWeekend = selectedDate ? [0, 6].includes(selectedDate.getDay()) : false;
    
    if (touched.fechaReserva && !formData.fechaReserva) {
      newErrors.fechaReserva = 'La fecha es obligatoria';
    } else if (touched.fechaReserva && formData.fechaReserva) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.fechaReserva = 'No puedes seleccionar una fecha pasada';
      }
    }
    
    if (touched.horaInicioReserva && !formData.horaInicioReserva) {
      newErrors.horaInicioReserva = 'La hora de inicio es obligatoria';
    } else if (touched.horaInicioReserva && formData.horaInicioReserva && selectedDate) {
      const [horaInicio] = formData.horaInicioReserva.split(':').map(Number);
      
      if (isWeekend) {
        if (horaInicio < 10 || horaInicio >= 22) {
          newErrors.horaInicioReserva = 'Fin de semana: horario debe ser entre 10:00 y 22:00';
        }
      } else {
        if (horaInicio < 14 || horaInicio >= 22) {
          newErrors.horaInicioReserva = 'Día de semana: horario debe ser entre 14:00 y 22:00';
        }
      }
    }
    
    setErrors(newErrors);
  }, [formData, touched]);

  const generateTimeOptions = () => {
    if (!formData.fechaReserva || errors.fechaReserva) return [];
    
    const selectedDate = new Date(formData.fechaReserva);
    const isWeekend = [0, 6].includes(selectedDate.getDay());
    const startHour = isWeekend ? 10 : 14;
    const endHour = 22;
    const options = [];
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const horaFin = new Date(0, 0, 0, hour, minute + duracionMinutos);
        if (horaFin.getHours() < endHour || 
            (horaFin.getHours() === endHour && horaFin.getMinutes() === 0)) {
          options.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
        }
      }
    }
    
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleChange = (field) => (e) => {
    const newData = { ...formData, [field]: e.target.value };
    setFormData(newData);
    setTouched({ ...touched, [field]: true });
  };

  const handleBlur = (field) => () => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setTouched({
      fechaReserva: true,
      horaInicioReserva: true
    });
    
    if (!formData.fechaReserva || !formData.horaInicioReserva || 
        errors.fechaReserva || errors.horaInicioReserva) {
      return;
    }
    
    onNext({
      ...formData,
      horaFinReserva,
      duracionTotal: `${duracionMinutos} MIN`
    });
  };

  const isFormValid = () => {
    return formData.fechaReserva && formData.horaInicioReserva &&
           !errors.fechaReserva && !errors.horaInicioReserva;
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
        Selecciona fecha y horario
      </Typography>
      
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Tarifa seleccionada:
        </Typography>
        <Typography variant="body1">
          {tarifaSeleccionada.nombre} - {tarifaSeleccionada.vueltas} o máximo {tarifaSeleccionada.tiempo}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Duración total: {tarifaSeleccionada.duracionTotal || tarifaSeleccionada.duracion}
        </Typography>
      </Box>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha de reserva"
              type="date"
              value={formData.fechaReserva}
              onChange={handleChange('fechaReserva')}
              onBlur={handleBlur('fechaReserva')}
              error={!!errors.fechaReserva}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <CalendarIcon sx={{ color: 'action.active', mr: 1 }} />
                ),
              }}
              helperText={errors.fechaReserva || 'Selecciona la fecha para tu reserva'}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Hora de inicio"
              type="time"
              value={formData.horaInicioReserva}
              onChange={handleChange('horaInicioReserva')}
              onBlur={handleBlur('horaInicioReserva')}
              error={!!errors.horaInicioReserva}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 1800,
                min: formData.fechaReserva ? 
                     (new Date(formData.fechaReserva).getDay() % 6 === 0 ? '10:00' : '14:00') : 
                     '14:00',
                max: '21:30'
              }}
              InputProps={{
                startAdornment: (
                  <ScheduleIcon sx={{ color: 'action.active', mr: 1 }} />
                ),
              }}
              helperText={errors.horaInicioReserva || 'Selecciona hora de inicio'}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ 
              p: 2, 
              border: '1px solid rgba(0, 0, 0, 0.23)', 
              borderRadius: 1,
              backgroundColor: '#fafafa'
            }}>
              <Typography variant="body1">
                <strong>Hora de finalización calculada:</strong> {horaFinReserva || '--:--'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Basado en la duración de la tarifa seleccionada
              </Typography>
            </Box>
          </Grid>
          
          {formData.fechaReserva && !errors.fechaReserva && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                Horarios disponibles para {new Date(formData.fechaReserva).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                mb: 2
              }}>
                {timeOptions.map((hora, index) => (
                  <Button
                    key={index}
                    variant={formData.horaInicioReserva === hora ? 'contained' : 'outlined'}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        horaInicioReserva: hora
                      });
                      setTouched({
                        ...touched,
                        horaInicioReserva: true
                      });
                    }}
                    sx={{ borderRadius: 2 }}
                  >
                    {hora}
                  </Button>
                ))}
              </Box>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center">
                  <InfoIcon sx={{ mr: 1 }} />
                  {new Date(formData.fechaReserva).getDay() % 6 === 0 ? (
                    <span>Sábados, Domingos y Feriados: horario de 10:00 a 22:00 horas.</span>
                  ) : (
                    <span>Lunes a Viernes: horario de 14:00 a 22:00 horas.</span>
                  )}
                </Box>
              </Alert>
            </Grid>
          )}
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<BackIcon />}
                onClick={onBack}
              >
                Volver
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<NextIcon />}
                disabled={!isFormValid()}
                sx={{ minWidth: 150 }}
              >
                Continuar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

const Paso3Participantes = ({ onNext, onBack, reservaId, initialValues }) => {
  const [rut, setRut] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [participantes, setParticipantes] = useState(initialValues.participantes || []);
  const [rutError, setRutError] = useState('');

  const validarRut = (rut) => {
    const rutRegex = /^(\d{7,8})-([\dkK])$/;
    return rutRegex.test(rut);
  };

  const buscarUsuario = async () => {
    if (!validarRut(rut)) {
      setRutError('Formato de RUT inválido. Use: 12345678-9');
      return;
    }
    
    setRutError('');
    setLoading(true);
    setError(null);
    
    try {
      const response = await usuariosService.getByRut(rut);
      if (response.data) {
        setUsuarioEncontrado(response.data);
      } else {
        setError('Usuario no encontrado');
        setUsuarioEncontrado(null);
      }
    } catch (err) {
      setError('Error al buscar usuario: ' + (err.response?.data?.message || err.message));
      setUsuarioEncontrado(null);
    } finally {
      setLoading(false);
    }
  };

  const agregarParticipante = async () => {
    if (!usuarioEncontrado) return;
    
    if (participantes.some(p => p.id === usuarioEncontrado.id)) {
      setError('Este participante ya está agregado');
      return;
    }
    
    try {
      await reservaService.agregarParticipante(reservaId, usuarioEncontrado.id);
      
      // Asignar descuento por frecuencia por defecto
      const descuentoResponse = await descuentoFrecuenciaServices.asignarDescuento(
        usuarioEncontrado.id, 
        reservaId
      );
      
      const nuevoParticipante = {
        ...usuarioEncontrado,
        nombreDescuento: descuentoResponse.data.nombre,
        porcentajeDescuento: descuentoResponse.data.descuento,
        tipoDescuentoSeleccionado: 'frecuencia'
      };
      
      setParticipantes([...participantes, nuevoParticipante]);
      setUsuarioEncontrado(null);
      setRut('');
      setError(null);
    } catch (err) {
      setError('Error al agregar participante: ' + (err.response?.data?.message || err.message));
    }
  };

  const eliminarParticipante = async (usuarioId) => {
    try {
      await reservaService.eliminarParticipante(reservaId, usuarioId);
      setParticipantes(participantes.filter(p => p.id !== usuarioId));
    } catch (err) {
      setError('Error al eliminar participante: ' + (err.response?.data?.message || err.message));
    }
  };

  const cambiarDescuento = async (usuarioId, tipoDescuento) => {
    try {
      let response;
      
      if (tipoDescuento === 'grupal') {
        response = await descuentoGrupalServices.asignarDescuento(
          usuarioId,
          participantes.length
        );
      } else {
        // Solo frecuencia si no es grupal
        response = await descuentoFrecuenciaServices.asignarDescuento(
          usuarioId,
          reservaId
        );
      }
      
      // Actualizar lista local
      setParticipantes(participantes.map(p => 
        p.id === usuarioId ? {
          ...p,
          nombreDescuento: response.data.nombre,
          porcentajeDescuento: response.data.descuento,
          tipoDescuentoSeleccionado: tipoDescuento
        } : p
      ));
      
    } catch (err) {
      setError('Error al cambiar descuento: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (participantes.length === 0) {
      setError('Debes agregar al menos un participante');
      return;
    }
    onNext({ participantes });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
        Agregar Participantes
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Busca usuarios por RUT para agregarlos a la reserva
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="RUT del participante"
              placeholder="12345678-9"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              error={!!rutError}
              helperText={rutError || 'Ingrese RUT en formato 12345678-9'}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={buscarUsuario} disabled={!rut || loading}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={buscarUsuario}
              disabled={!rut || loading}
              fullWidth
              startIcon={<SearchIcon />}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        
        {usuarioEncontrado && (
          <Paper elevation={1} sx={{ p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle1">
                  {usuarioEncontrado.nombre} {usuarioEncontrado.apellido}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  RUT: {usuarioEncontrado.rut} | Email: {usuarioEncontrado.email}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AddIcon />}
                onClick={agregarParticipante}
                disabled={participantes.some(p => p.id === usuarioEncontrado.id)}
              >
                {participantes.some(p => p.id === usuarioEncontrado.id) ? 'Ya agregado' : 'Agregar'}
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Participantes agregados ({participantes.length})
      </Typography>
      
      {participantes.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No hay participantes agregados aún
        </Alert>
      ) : (
        <List>
          {participantes.map((participante) => (
            <ListItem key={participante.id} sx={{ border: '1px solid #e0e0e0', mb: 1, borderRadius: 1 }}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                {participante.nombre.charAt(0)}{participante.apellido.charAt(0)}
              </Avatar>
              <ListItemText
                primary={`${participante.nombre} ${participante.apellido}`}
                secondary={
                  <>
                    <span>RUT: {participante.rut}</span>
                    <br />
                    <span>Email: {participante.email}</span>
                  </>
                }
              />
              
              <Box sx={{ minWidth: 200, mr: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de Descuento</InputLabel>
                  <Select
                    value={participante.tipoDescuentoSeleccionado || 'frecuencia'}
                    onChange={(e) => cambiarDescuento(participante.id, e.target.value)}
                    label="Tipo de Descuento"
                  >
                    <MenuItem value="frecuencia">Descuento por Frecuencia</MenuItem>
                    <MenuItem value="grupal">Descuento Grupal</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ mr: 2 }}>
                <Chip 
                  label={`${participante.nombreDescuento} - ${(participante.porcentajeDescuento * 100).toFixed(0)}%`}
                  color="success"
                  variant="outlined"
                  size="small"
                />
              </Box>
              
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  onClick={() => eliminarParticipante(participante.id)}
                  color="error"
                >
                  <ClearIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={onBack}
              startIcon={<BackIcon />}
            >
              Volver
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={participantes.length === 0}
              endIcon={<NextIcon />}
            >
              Continuar ({participantes.length})
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

const Paso4Confirmacion = ({ onBack, onComplete, reservaData }) => {
  const [valoresCalculados, setValoresCalculados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calcularValores = async () => {
      try {
        const reservaActualizada = await reservaService.getById(reservaData.id);
        const participantes = reservaActualizada.data.usuarios || [];
        
        const precioBase = reservaData.tarifaSeleccionada.preciosRegulares;
        const numeroParticipantes = participantes.length;
        
        let subtotalSinDescuentos = precioBase * numeroParticipantes;
        let totalDescuentos = 0;
        
        participantes.forEach(participante => {
          if (participante.porcentajeDescuento > 0) {
            const descuentoParticipante = precioBase * participante.porcentajeDescuento;
            totalDescuentos += descuentoParticipante;
          }
        });
        
        const precioNeto = subtotalSinDescuentos - totalDescuentos;
        const precioIva = precioNeto * 0.19;
        const valorFinal = precioNeto + precioIva;
        
        setValoresCalculados({
          participantes,
          precioBase,
          numeroParticipantes,
          subtotalSinDescuentos,
          totalDescuentos,
          precioNeto: Math.round(precioNeto),
          precioIva: Math.round(precioIva),
          valorFinal: Math.round(valorFinal)
        });
        
        setLoading(false);
      } catch (err) {
        setError('Error al calcular los valores de la reserva: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    if (reservaData.id) {
      calcularValores();
    }
  }, [reservaData]);

  const handleConfirmarReserva = async () => {
    try {
      await reservaService.calcularValoresReserva(reservaData.id);
      onComplete();
    } catch (err) {
      setError('Error al confirmar la reserva: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Calculando valores...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={onBack} variant="outlined">Volver</Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
        Confirmación de Reserva
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>Detalles de la Reserva</Typography>
          
          <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
            <Typography variant="body1">
              <strong>Tarifa:</strong> {reservaData.tarifaSeleccionada.nombre}
            </Typography>
            <Typography variant="body1">
              <strong>Fecha:</strong> {new Date(reservaData.fechaReserva).toLocaleDateString('es-ES')}
            </Typography>
            <Typography variant="body1">
              <strong>Horario:</strong> {reservaData.horaInicioReserva} - {reservaData.horaFinReserva}
            </Typography>
            <Typography variant="body1">
              <strong>Duración:</strong> {reservaData.duracionTotal}
            </Typography>
            <Typography variant="body1">
              <strong>Participantes:</strong> {valoresCalculados?.numeroParticipantes || 0}
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{ mb: 2 }}>Participantes y Descuentos</Typography>
          <List dense>
            {valoresCalculados?.participantes?.map((participante) => (
              <ListItem key={participante.id} sx={{ px: 0 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body1" component="div" sx={{ fontWeight: 'medium' }}>
                    {participante.nombre} {participante.apellido}
                  </Typography>
                  <Typography variant="body2" component="div" color="text.secondary">
                    RUT: {participante.rut}
                  </Typography>
                  <Typography variant="body2" component="div" color="text.secondary">
                    Email: {participante.email}
                  </Typography>
                  {participante.porcentajeDescuento > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={`${participante.nombreDescuento} - ${(participante.porcentajeDescuento * 100).toFixed(0)}%`}
                        color="success"
                        variant="outlined"
                        size="small"
                        sx={{ mb: 0.5 }}
                      />
                      <Typography variant="body2" component="div">
                        Descuento: ${(valoresCalculados.precioBase * participante.porcentajeDescuento).toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>Detalle de Pagos</Typography>
          
          <Box sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Precio base por persona:</strong> ${valoresCalculados?.precioBase?.toLocaleString()}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Número de participantes:</strong> {valoresCalculados?.numeroParticipantes}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Subtotal sin descuentos:</strong> ${valoresCalculados?.subtotalSinDescuentos?.toLocaleString()}
            </Typography>
            
            {valoresCalculados?.totalDescuentos > 0 && (
              <Typography variant="body1" sx={{ mb: 2, color: 'success.main' }}>
                <strong>Total descuentos aplicados:</strong> -${valoresCalculados?.totalDescuentos?.toLocaleString()}
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Precio neto:</strong> ${valoresCalculados?.precioNeto?.toLocaleString()}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>IVA (19%):</strong> ${valoresCalculados?.precioIva?.toLocaleString()}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              <strong>Total a pagar:</strong> ${valoresCalculados?.valorFinal?.toLocaleString()}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Alert severity="info">
              <Box>
                <Typography variant="body2" component="div">
                  <strong>Información importante:</strong>
                </Typography>
                <Typography variant="body2" component="div">
                  • Al confirmar, recibirás un correo con los detalles de tu reserva
                </Typography>
                <Typography variant="body2" component="div">
                  • Los descuentos se han aplicado automáticamente según los criterios
                </Typography>
                <Typography variant="body2" component="div">
                  • El precio incluye IVA
                </Typography>
              </Box>
            </Alert>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={onBack}
          startIcon={<BackIcon />}
          sx={{ minWidth: 150 }}
        >
          Volver
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmarReserva}
          endIcon={<CheckIcon />}
          sx={{ minWidth: 200 }}
        >
          Confirmar Reserva
        </Button>
      </Box>
    </Paper>
  );
};

const ReservaPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [reservaData, setReservaData] = useState({
    tarifa: null,
    tarifaSeleccionada: null,
    fechaReserva: '',
    horaInicioReserva: '',
    horaFinReserva: '',
    duracionTotal: '',
    participantes: [],
    id: null
  });
  const [reservaCompletada, setReservaCompletada] = useState(false);

  const steps = [
    'Selección de tarifa',
    'Fecha y horario',
    'Participantes',
    'Confirmación'
  ];

  const handleNext = (stepData) => {
    const newData = { ...reservaData, ...stepData };
    
    if (activeStep === 1) {
      const crearReserva = async () => {
        try {
          const reservaCreada = await reservaService.create({
            fechaReserva: newData.fechaReserva,
            horaInicioReserva: newData.horaInicioReserva,
            horaFinReserva: newData.horaFinReserva,
            tarifaEscogida: newData.tarifaSeleccionada.nombre,
            vueltas: newData.tarifaSeleccionada.vueltas,
            tiempo: newData.tarifaSeleccionada.tiempo,
            valorTarifaEscogida: newData.tarifaSeleccionada.preciosRegulares
          });
          
          newData.id = reservaCreada.data.id;
          setReservaData(newData);
          setActiveStep((prevStep) => prevStep + 1);
        } catch (err) {
          console.error('Error al crear reserva:', err);
        }
      };
      
      crearReserva();
    } else {
      setReservaData(newData);
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleComplete = () => {
    setReservaCompletada(true);
  };

  return (
    <Container maxWidth="lg" className="reservas-container">
      <Navbar />
      
      <Typography variant="h3" component="h1" gutterBottom className="page-title">
        Reserva de Actividad
      </Typography>
      
    {reservaCompletada ? (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          ¡Reserva confirmada con éxito!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Hemos enviado los detalles de tu reserva a tu correo electrónico.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.reload()}
          >
            Hacer otra reserva
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={async () => {
              try {
                const response = await reservaService.generarComprobante(reservaData.id);
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `comprobante-reserva-${reservaData.id}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
              } catch (error) {
                console.error('Error al generar comprobante:', error);
                alert('Error al generar el comprobante');
              }
            }}
          >
            Descargar Comprobante
          </Button>
        </Box>
      </Paper>
      ) : (
        <>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === 0 && (
            <Paso1Tarifa onNext={handleNext} />
          )}
          
          {activeStep === 1 && (
            <Paso2Horario 
              onNext={handleNext}
              onBack={handleBack}
              tarifaSeleccionada={reservaData.tarifaSeleccionada}
              initialValues={reservaData}
            />
          )}
          
          {activeStep === 2 && (
            <Paso3Participantes 
              onNext={handleNext}
              onBack={handleBack}
              reservaId={reservaData.id}
              initialValues={reservaData}
            />
          )}
          
          {activeStep === 3 && (
            <Paso4Confirmacion 
              onBack={handleBack}
              onComplete={handleComplete}
              reservaData={reservaData}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default ReservaPage;