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
  TextField,
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
  Chip,
  Avatar,
  InputAdornment,
  FormHelperText,
  Box
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Cake as CakeIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import usuariosService from '../services/usuariosServices';
import './Usuarios.css';
import Navbar from '../componentes/Navbar';

// Utilidades para validación
const validateRut = (rut) => {
  if (!rut) return false;
  
  // Formato: 12345678-9
  const rutPattern = /^\d{7,8}-[0-9kK]$/;
  if (!rutPattern.test(rut)) return false;
  
  // Validación del dígito verificador
  const [numero, dv] = rut.split('-');
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const dvCalculado = 11 - (suma % 11);
  const dvFinal = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'K' : dvCalculado.toString();
  
  return dv.toUpperCase() === dvFinal;
};

const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const formatRutInput = (value) => {
  // Remover caracteres no válidos
  const cleaned = value.replace(/[^0-9kK]/g, '');
  
  // Formatear automáticamente
  if (cleaned.length <= 1) return cleaned;
  if (cleaned.length <= 8) {
    return cleaned.slice(0, -1) + '-' + cleaned.slice(-1);
  }
  return cleaned.slice(0, 8) + '-' + cleaned.slice(8, 9);
};

const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = typeof dateString === 'string' ? 
                 new Date(dateString + 'T00:00:00') : 
                 new Date(dateString);
    
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

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? 
                 new Date(dateString + 'T00:00:00') : 
                 new Date(dateString);
    
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error('Error formateando fecha para input:', e);
    return '';
  }
};

const Usuarios = () => {
  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Estados para búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para diálogos y feedback
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState({
    id: '',
    rut: '',
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: '',
    ultimaVisita: '',
    visitas: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Estados para validación
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Cargar datos iniciales
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filtrar usuarios según término de búsqueda
  useEffect(() => {
    const filtered = usuarios.filter(usuario =>
      usuario.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsuarios(filtered);
  }, [searchTerm, usuarios]);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usuariosService.getAll();
      const usuariosData = response.data.map(user => ({
        ...user,
        fechaNacimiento: user.fechaNacimiento || null,
        ultimaVisita: user.ultimaVisita || null
      }));
      setUsuarios(usuariosData);
      setFilteredUsuarios(usuariosData);
    } catch (err) {
      console.error('Error fetching usuarios:', err);
      setError('Error al cargar los usuarios. Por favor, intenta nuevamente.');
      showSnackbar('Error al cargar los usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validar RUT
    if (!currentUsuario.rut) {
      errors.rut = 'El RUT es obligatorio';
    } else if (!validateRut(currentUsuario.rut)) {
      errors.rut = 'El RUT no tiene un formato válido';
    }
    
    // Validar nombre
    if (!currentUsuario.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    } else if (currentUsuario.nombre.length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }
    
    // Validar apellido
    if (!currentUsuario.apellido.trim()) {
      errors.apellido = 'El apellido es obligatorio';
    } else if (currentUsuario.apellido.length < 2) {
      errors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }
    
    // Validar email
    if (!currentUsuario.email) {
      errors.email = 'El email es obligatorio';
    } else if (!validateEmail(currentUsuario.email)) {
      errors.email = 'El email no tiene un formato válido';
    }
    
    // Validar fecha de nacimiento
    if (!currentUsuario.fechaNacimiento) {
      errors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    } else {
      const age = calculateAge(currentUsuario.fechaNacimiento);
      if (age < 0) {
        errors.fechaNacimiento = 'La fecha de nacimiento no puede ser futura';
      } else if (age > 120) {
        errors.fechaNacimiento = 'La fecha de nacimiento no es válida';
      }
    }
    
    // Validar visitas
    if (currentUsuario.visitas < 0) {
      errors.visitas = 'El número de visitas no puede ser negativo';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = () => {
    setCurrentUsuario({
      id: '',
      rut: '',
      nombre: '',
      apellido: '',
      email: '',
      fechaNacimiento: '',
      ultimaVisita: '',
      visitas: 0
    });
    setIsEditing(false);
    setValidationErrors({});
    setTouched({});
    setOpenDialog(true);
  };

  const handleEdit = (usuario) => {
    setCurrentUsuario({
      ...usuario,
      fechaNacimiento: formatDateForInput(usuario.fechaNacimiento),
      ultimaVisita: formatDateForInput(usuario.ultimaVisita)
    });
    setIsEditing(true);
    setValidationErrors({});
    setTouched({});
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    const usuario = usuarios.find(u => u.id === id);
    if (window.confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`)) {
      try {
        await usuariosService.remove(id);
        showSnackbar('Usuario eliminado correctamente', 'success');
        fetchUsuarios();
      } catch (err) {
        showSnackbar('Error al eliminar usuario', 'error');
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showSnackbar('Por favor, corrige los errores en el formulario', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await usuariosService.update(currentUsuario.id, currentUsuario);
        showSnackbar('Usuario actualizado correctamente', 'success');
      } else {
        await usuariosService.create(currentUsuario);
        showSnackbar('Usuario creado correctamente', 'success');
      }
      setOpenDialog(false);
      fetchUsuarios();
    } catch (err) {
      showSnackbar(`Error al ${isEditing ? 'actualizar' : 'crear'} usuario`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInitialize = async () => {
    if (window.confirm('¿Estás seguro de inicializar usuarios con datos de prueba? Esta acción puede afectar los datos existentes.')) {
      try {
        await usuariosService.initializeUsers();
        showSnackbar('Usuarios inicializados correctamente', 'success');
        fetchUsuarios();
      } catch (err) {
        showSnackbar('Error al inicializar usuarios', 'error');
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

  const handleInputChange = (field, value) => {
    setCurrentUsuario({ ...currentUsuario, [field]: value });
    
    // Marcar campo como tocado
    setTouched({ ...touched, [field]: true });
    
    // Validar en tiempo real
    if (touched[field]) {
      const tempErrors = { ...validationErrors };
      
      switch (field) {
        case 'rut':
          if (!value) {
            tempErrors.rut = 'El RUT es obligatorio';
          } else if (!validateRut(value)) {
            tempErrors.rut = 'El RUT no tiene un formato válido';
          } else {
            delete tempErrors.rut;
          }
          break;
        case 'nombre':
          if (!value.trim()) {
            tempErrors.nombre = 'El nombre es obligatorio';
          } else if (value.length < 2) {
            tempErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
          } else {
            delete tempErrors.nombre;
          }
          break;
        case 'apellido':
          if (!value.trim()) {
            tempErrors.apellido = 'El apellido es obligatorio';
          } else if (value.length < 2) {
            tempErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
          } else {
            delete tempErrors.apellido;
          }
          break;
        case 'email':
          if (!value) {
            tempErrors.email = 'El email es obligatorio';
          } else if (!validateEmail(value)) {
            tempErrors.email = 'El email no tiene un formato válido';
          } else {
            delete tempErrors.email;
          }
          break;
        case 'fechaNacimiento':
          if (!value) {
            tempErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
          } else {
            const age = calculateAge(value);
            if (age < 0) {
              tempErrors.fechaNacimiento = 'La fecha de nacimiento no puede ser futura';
            } else if (age > 120) {
              tempErrors.fechaNacimiento = 'La fecha de nacimiento no es válida';
            } else {
              delete tempErrors.fechaNacimiento;
            }
          }
          break;
        case 'visitas':
          if (value < 0) {
            tempErrors.visitas = 'El número de visitas no puede ser negativo';
          } else {
            delete tempErrors.visitas;
          }
          break;
      }
      
      setValidationErrors(tempErrors);
    }
  };

  const handleRutChange = (e) => {
    const formatted = formatRutInput(e.target.value);
    handleInputChange('rut', formatted);
  };

  const getFieldError = (field) => {
    return touched[field] && validationErrors[field];
  };

  const handleCloseDialog = () => {
    if (Object.keys(touched).length > 0) {
      if (window.confirm('¿Estás seguro de cerrar? Se perderán los cambios no guardados.')) {
        setOpenDialog(false);
        setTouched({});
        setValidationErrors({});
      }
    } else {
      setOpenDialog(false);
    }
  };
    const handleResetVisits = async () => {
    if (window.confirm('¿Estás seguro de reiniciar el contador de visitas de todos los usuarios a cero?')) {
      try {
        await usuariosService.reinciarVisitas();
        showSnackbar('Contador de visitas reiniciado correctamente', 'success');
        fetchUsuarios();
      } catch (err) {
        showSnackbar('Error al reiniciar visitas', 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" className="usuarios-container">
      <Navbar/>
      <Typography variant="h3" component="h1" gutterBottom className="page-title">
        Administración de Usuarios
      </Typography>

      {/* Controles superiores */}
      <Paper elevation={1} className="controls-container" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              label="Buscar por RUT, nombre o email"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              helperText={`Mostrando ${filteredUsuarios.length} de ${usuarios.length} usuarios`}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              fullWidth
              size="large"
            >
              Nuevo Usuario
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={fetchUsuarios}
              fullWidth
              size="large"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Recargar'}
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="contained"
              color="warning"
              startIcon={<PersonIcon />}
              onClick={handleInitialize}
              fullWidth
              size="large"
            >
              Inicializar Datos
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={handleResetVisits}
              fullWidth
              size="large"
            >
              Reiniciar Visitas
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Información de estado */}
      {usuarios.length === 0 && !loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center">
            <InfoIcon sx={{ mr: 1 }} />
            No hay usuarios registrados. Puedes crear uno nuevo o inicializar con datos de prueba.
          </Box>
        </Alert>
      )}

      {/* Tabla de usuarios */}
      {loading ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando usuarios...
          </Typography>
        </Paper>
      ) : error ? (
        <Alert severity="error" className="error-alert">
          <Box display="flex" alignItems="center">
            <WarningIcon sx={{ mr: 1 }} />
            {error}
          </Box>
        </Alert>
      ) : (
        <TableContainer component={Paper} className="table-container" elevation={3}>
          <Table aria-label="Tabla de usuarios" stickyHeader>
            <TableHead>
              <TableRow className="table-header">
                <TableCell>Usuario</TableCell>
                <TableCell>RUT</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Visitas</TableCell>
                <TableCell>Última Visita</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id} hover className="table-row">
                  <TableCell>
                    <div className="user-info">
                      <Avatar className="user-avatar">
                        {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                      </Avatar>
                      <div>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          {usuario.nombre} {usuario.apellido}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          <CakeIcon fontSize="small" sx={{ mr: 0.5 }} />
                          {formatDate(usuario.fechaNacimiento)}
                          {usuario.fechaNacimiento && (
                            <span> ({calculateAge(usuario.fechaNacimiento)} años)</span>
                          )}
                        </Typography>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {usuario.rut}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {usuario.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${usuario.visitas} visitas`} 
                      color={usuario.visitas > 5 ? 'primary' : usuario.visitas > 0 ? 'secondary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {usuario.ultimaVisita ? (
                      <Typography variant="body2">
                        <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {formatDate(usuario.ultimaVisita)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Nunca
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar usuario">
                      <IconButton
                        onClick={() => handleEdit(usuario)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar usuario">
                      <IconButton
                        onClick={() => handleDelete(usuario.id)}
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

      {/* Diálogo para edición/creación */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: { minHeight: '600px' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="div">
            {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {isEditing ? 'Modifica los campos necesarios' : 'Completa todos los campos obligatorios'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} className="dialog-form" sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="RUT"
                placeholder="12345678-9"
                fullWidth
                value={currentUsuario.rut}
                onChange={handleRutChange}
                error={!!getFieldError('rut')}
                helperText={getFieldError('rut') || 'Formato: 12345678-9'}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                placeholder="Juan"
                fullWidth
                value={currentUsuario.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                error={!!getFieldError('nombre')}
                helperText={getFieldError('nombre') || 'Mínimo 2 caracteres'}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellido"
                placeholder="Pérez"
                fullWidth
                value={currentUsuario.apellido}
                onChange={(e) => handleInputChange('apellido', e.target.value)}
                error={!!getFieldError('apellido')}
                helperText={getFieldError('apellido') || 'Mínimo 2 caracteres'}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                placeholder="juan.perez@ejemplo.com"
                fullWidth
                type="email"
                value={currentUsuario.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!getFieldError('email')}
                helperText={getFieldError('email') || 'Formato: usuario@dominio.com'}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Nacimiento"
                type="date"
                fullWidth
                value={currentUsuario.fechaNacimiento}
                onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                error={!!getFieldError('fechaNacimiento')}
                helperText={getFieldError('fechaNacimiento') || (currentUsuario.fechaNacimiento ? `Edad: ${calculateAge(currentUsuario.fechaNacimiento)} años` : 'Selecciona tu fecha de nacimiento')}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Número de Visitas"
                type="number"
                fullWidth
                value={currentUsuario.visitas}
                onChange={(e) => handleInputChange('visitas', parseInt(e.target.value) || 0)}
                error={!!getFieldError('visitas')}
                helperText={getFieldError('visitas') || 'Número de visitas realizadas'}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            {/* Información adicional para usuarios existentes */}
            {isEditing && (
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Información adicional
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>ID:</strong> {currentUsuario.id}
                  </Typography>
                  {currentUsuario.ultimaVisita && (
                    <Typography variant="body2" color="textSecondary">
                      <strong>Última visita:</strong> {formatDate(currentUsuario.ultimaVisita)}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleCloseDialog} 
            color="secondary"
            startIcon={<CancelIcon />}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={submitting || Object.keys(validationErrors).length > 0}
          >
            {submitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario')}
          </Button>
        </DialogActions>
      </Dialog>

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

export default Usuarios;