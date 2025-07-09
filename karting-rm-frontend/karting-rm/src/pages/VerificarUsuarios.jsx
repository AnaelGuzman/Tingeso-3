import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
  Box,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import usuariosService from '../services/usuariosServices';
import Navbar from '../componentes/Navbar';
import './VerificarUsuarios.css';

const VerificarUsuarios = () => {
  const [rut, setRut] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mostrarFormularioRegistro, setMostrarFormularioRegistro] = useState(false);
  const [pasoRegistro, setPasoRegistro] = useState(0);
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: ''
  });
  const [erroresFormulario, setErroresFormulario] = useState({});
  const [registroExitoso, setRegistroExitoso] = useState(false);

  // Función para formatear el RUT mientras se escribe
  const formatearRut = (value) => {
    // Eliminar todo lo que no sea número o k/K
    let rutLimpio = value.replace(/[^0-9kK]/g, '');
    
    // Si es muy largo, truncar
    if (rutLimpio.length > 9) {
      rutLimpio = rutLimpio.substring(0, 9);
    }
    
    // Agregar guión antes del dígito verificador
    if (rutLimpio.length > 1) {
      rutLimpio = rutLimpio.substring(0, rutLimpio.length - 1) + '-' + rutLimpio.substring(rutLimpio.length - 1);
    }
    
    return rutLimpio.toUpperCase();
  };

  const validarRut = (rut) => {
    const rutRegex = /^(\d{7,8})-([\dkK])$/;
    return rutRegex.test(rut);
  };

  const buscarUsuario = async () => {
    if (!validarRut(rut)) {
      setError('Formato de RUT inválido. Ejemplo: 12345678-9');
      return;
    }

    setError('');
    setLoading(true);
    setUsuarioEncontrado(null);

    try {
      const response = await usuariosService.getByRut(rut);
      if (response.data) {
        setUsuarioEncontrado(response.data);
      } else {
        setError('Usuario no encontrado. ¿Desea registrarse?');
      }
    } catch (err) {
      setError('-> ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRegistroClick = () => {
    setFormData(prev => ({ ...prev, rut }));
    setMostrarFormularioRegistro(true);
    setError('');
  };

  const handleInputChange = (field) => (e) => {
    let value = e.target.value;
    
    // Aplicar formato especial para el RUT
    if (field === 'rut') {
      value = formatearRut(value);
    }
    
    setFormData({ ...formData, [field]: value });
    
    // Limpiar error al editar
    if (erroresFormulario[field]) {
      setErroresFormulario({ ...erroresFormulario, [field]: '' });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.rut) {
      nuevosErrores.rut = 'RUT es requerido';
    } else if (!validarRut(formData.rut)) {
      nuevosErrores.rut = 'Formato de RUT inválido. Ejemplo: 12345678-9';
    }
    
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'Nombre es requerido';
    if (!formData.apellido.trim()) nuevosErrores.apellido = 'Apellido es requerido';
    if (!formData.email.trim()) {
      nuevosErrores.email = 'Email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      nuevosErrores.email = 'Email no válido';
    }
    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'Fecha de nacimiento es requerida';
    } else if (!validarEdad(formData.fechaNacimiento)) {
      nuevosErrores.fechaNacimiento = 'Debes tener entre 6 y 100 años para registrarte';
    }

    setErroresFormulario(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSiguientePaso = () => {
    if (validarFormulario()) {
      setPasoRegistro(pasoRegistro + 1);
    }
  };

  const handleAnteriorPaso = () => {
    setPasoRegistro(pasoRegistro - 1);
  };

  const registrarUsuario = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      const usuarioData = {
        ...formData,
        visitas: 0,
        ultimaVisita: null,
        nombreDescuento: '',
        porcentajeDescuento: 0,
        tarifaFinal: 0
      };

      await usuariosService.create(usuarioData);
      setRegistroExitoso(true);
    } catch (err) {
      setError('Error al registrar usuario: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

    const validarEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return false;
    
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    // Ajustar edad si aún no ha pasado el mes de cumpleaños
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad >= 6 && edad <= 100;
  };

  const pasosRegistro = ['Datos personales', 'Confirmación'];

  return (
    <Container maxWidth="md" className="cliente-verificacion-container">
      <Navbar />
      
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1e3c72' }}>
          Verificación de Cliente
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Para realizar una reserva, primero verifica si tú y tus amigos están registrados en nuestro sistema.
        </Typography>

        {!mostrarFormularioRegistro && !registroExitoso && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Verifica si ya estás registrado
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="rut-input">Ingresa tu RUT</InputLabel>
                    <OutlinedInput
                      id="rut-input"
                      value={rut}
                      onChange={(e) => setRut(formatearRut(e.target.value))}
                      label="Ingresa tu RUT"
                      placeholder="12345678-9"
                      error={!!error && !loading}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={buscarUsuario}
                            edge="end"
                            disabled={!rut || loading}
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <FormHelperText sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <InfoIcon color="info" sx={{ mr: 1, fontSize: '1rem' }} />
                      Formato: 12345678-9
                    </FormHelperText>
                    {error && !loading && (
                      <FormHelperText error>{error}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={buscarUsuario}
                    disabled={!rut || loading}
                    startIcon={<SearchIcon />}
                    sx={{ height: '56px' }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Verificar'}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {usuarioEncontrado && (
              <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: '#f5f5f5' }}>
                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    {usuarioEncontrado.nombre.charAt(0)}{usuarioEncontrado.apellido.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {usuarioEncontrado.nombre} {usuarioEncontrado.apellido}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      RUT: {usuarioEncontrado.rut} | Email: {usuarioEncontrado.email}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowIcon />}
                    onClick={() => window.location.href = '/reserva'}
                  >
                    Continuar a reserva
                  </Button>
                </Box>
              </Paper>
            )}

            {error && error.includes('no encontrado') && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  ¿Eres nuevo? Completa tus datos para registrarte.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  onClick={handleRegistroClick}
                  sx={{ borderRadius: '28px', px: 4 }}
                >
                  Registrarme
                </Button>
              </Box>
            )}
          </>
        )}

        {mostrarFormularioRegistro && !registroExitoso && (
          <>
            <Stepper activeStep={pasoRegistro} alternativeLabel sx={{ mb: 4 }}>
              {pasosRegistro.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {pasoRegistro === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="RUT"
                    value={formData.rut}
                    onChange={handleInputChange('rut')}
                    error={!!erroresFormulario.rut}
                    helperText={erroresFormulario.rut || "Formato: 12345678-9"}
                    placeholder="12345678-9"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    value={formData.nombre}
                    onChange={handleInputChange('nombre')}
                    error={!!erroresFormulario.nombre}
                    helperText={erroresFormulario.nombre}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellido"
                    value={formData.apellido}
                    onChange={handleInputChange('apellido')}
                    error={!!erroresFormulario.apellido}
                    helperText={erroresFormulario.apellido}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={!!erroresFormulario.email}
                    helperText={erroresFormulario.email || "Ejemplo: usuario@dominio.com"}
                    required
                  />
                </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Fecha de Nacimiento"
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={handleInputChange('fechaNacimiento')}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        max: new Date(new Date().setFullYear(new Date().getFullYear() - 6)).toISOString().split('T')[0],
                        min: new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]
                      }}
                      error={!!erroresFormulario.fechaNacimiento}
                      helperText={erroresFormulario.fechaNacimiento || "Debes tener entre 6 y 100 años"}
                      required
                    />
                  </Grid>
              </Grid>
            )}

            {pasoRegistro === 1 && (
              <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Confirma tus datos
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography><strong>RUT:</strong> {formData.rut}</Typography>
                  <Typography><strong>Nombre:</strong> {formData.nombre} {formData.apellido}</Typography>
                  <Typography><strong>Email:</strong> {formData.email}</Typography>
                  <Typography><strong>Fecha de Nacimiento:</strong> {formData.fechaNacimiento}</Typography>
                </Box>
                
                <Alert severity="info" sx={{ mb: 3 }}>
                  Al registrarte, aceptas nuestros términos y condiciones de servicio.
                </Alert>
              </Paper>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              {pasoRegistro > 0 ? (
                <Button
                  variant="outlined"
                  onClick={handleAnteriorPaso}
                  disabled={loading}
                >
                  Anterior
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => setMostrarFormularioRegistro(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              )}
              
              {pasoRegistro < pasosRegistro.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSiguientePaso}
                  disabled={loading}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={registrarUsuario}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
                >
                  Confirmar Registro
                </Button>
              )}
            </Box>
          </>
        )}

        {registroExitoso && (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <CheckIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              ¡Registro exitoso!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Ahora puedes continuar con tu reserva.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => window.location.href = '/createReserva1'}
              endIcon={<ArrowIcon />}
            >
              Continuar a Reserva
            </Button>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default VerificarUsuarios;