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
  Slider,
  Box,
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  AttachMoney as AttachMoneyIcon,
  SettingsBackupRestore as InitializeIcon,
  Event as EventIcon
} from '@mui/icons-material';
import tarifasService from '../services/tarifaServices';
import tarifasEspecialesService from '../services/tarifaEspecialesServices';
import Navbar from '../componentes/Navbar';
import './Tarifas.css';

const Tarifas = () => {
  // Estados para tabs
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para tarifas regulares
  const [tarifas, setTarifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para tarifas especiales
  const [tarifasEspeciales, setTarifasEspeciales] = useState([]);
  const [loadingEspecial, setLoadingEspecial] = useState(true);
  
  // Estados compartidos
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Diálogos y estados de formulario
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogEspecial, setOpenDialogEspecial] = useState(false);
  const [currentTarifa, setCurrentTarifa] = useState({
    id: '', nombre: '', vueltas: '', tiempo: '', preciosRegulares: 0, duracionTotal: ''
  });
  const [currentEspecial, setCurrentEspecial] = useState({
    id: '', nombre: '', dia: '', mes: '', vueltas: '', tiempo: '', duracion: '', preciosRegulares: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEspecial, setIsEditingEspecial] = useState(false);
  const [weekendMultiplier, setWeekendMultiplier] = useState(1.2);
  const [multiplierDialogOpen, setMultiplierDialogOpen] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    fetchTarifas();
    fetchTarifasEspeciales();
  }, []);

  // Funciones para tarifas regulares
  const fetchTarifas = async () => {
    setLoading(true);
    try {
      const response = await tarifasService.getAll();
      setTarifas(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las tarifas');
      showSnackbar('Error al cargar tarifas regulares', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeRates = async () => {
    if (window.confirm('¿Estás seguro de inicializar las tarifas regulares?')) {
      try {
        await tarifasService.initializeRates();
        showSnackbar('Tarifas regulares inicializadas', 'success');
        fetchTarifas();
      } catch (err) {
        showSnackbar('Error al inicializar tarifas regulares', 'error');
      }
    }
  };

  // Funciones para tarifas especiales
  const fetchTarifasEspeciales = async () => {
    setLoadingEspecial(true);
    try {
      const response = await tarifasEspecialesService.getAll();
      setTarifasEspeciales(response.data);
    } catch (err) {
      showSnackbar('Error al cargar tarifas especiales', 'error');
    } finally {
      setLoadingEspecial(false);
    }
  };

  const handleCreateEspecial = () => {
    setCurrentEspecial({ 
      id: '', nombre: '', dia: '', mes: '', 
      vueltas: '', tiempo: '', duracion: '', preciosRegulares: 0 
    });
    setIsEditingEspecial(false);
    setOpenDialogEspecial(true);
  };

  const handleEditEspecial = (tarifa) => {
    setCurrentEspecial(tarifa);
    setIsEditingEspecial(true);
    setOpenDialogEspecial(true);
  };

  const handleDeleteEspecial = async (id) => {
    if (window.confirm('¿Eliminar esta tarifa especial?')) {
      try {
        await tarifasEspecialesService.remove(id);
        showSnackbar('Tarifa especial eliminada', 'success');
        fetchTarifasEspeciales();
      } catch (err) {
        showSnackbar('Error al eliminar tarifa especial', 'error');
      }
    }
  };

  const handleSubmitEspecial = async () => {
    try {
      if (isEditingEspecial) {
        await tarifasEspecialesService.update(currentEspecial);
        showSnackbar('Tarifa especial actualizada', 'success');
      } else {
        await tarifasEspecialesService.create(currentEspecial);
        showSnackbar('Tarifa especial creada', 'success');
      }
      setOpenDialogEspecial(false);
      fetchTarifasEspeciales();
    } catch (err) {
      showSnackbar(`Error al ${isEditingEspecial ? 'actualizar' : 'crear'} tarifa especial`, 'error');
    }
  };

  const handleInitializeEspecial = async () => {
    if (window.confirm('¿Inicializar tarifas especiales con valores por defecto?')) {
      try {
        await tarifasEspecialesService.initializeRates();
        showSnackbar('Tarifas especiales inicializadas', 'success');
        fetchTarifasEspeciales();
      } catch (err) {
        showSnackbar('Error al inicializar tarifas especiales', 'error');
      }
    }
  };

  // Funciones compartidas
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" className="tarifas-container">
      <Navbar />
      
      <Typography variant="h3" component="h1" gutterBottom className="page-title">
        <AttachMoneyIcon fontSize="large" /> Gestión de Tarifas
      </Typography>

        <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        aria-label="tabs de tarifas"
        sx={{
            '& .MuiTab-root': {
            color: 'white', // Color texto no seleccionado
            opacity: 0.7,
            '&.Mui-selected': {
                color: '#ff9800', // Color texto seleccionado (naranja)
                opacity: 1
            },
            '&:hover': {
                color: '#ffb74d', // Color hover (naranja claro)
                opacity: 1
            }
            },
            '& .MuiTabs-indicator': {
            backgroundColor: '#ff9800' // Color del indicador (naranja)
            }
        }}
        >
        <Tab label="Tarifas Regulares" icon={<AttachMoneyIcon />} />
        <Tab label="Tarifas Especiales" icon={<EventIcon />} />
        </Tabs>

      {tabValue === 0 ? (
        <>
          {/* Controles para tarifas regulares */}
          <Grid container spacing={2} className="controls-container">
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  setCurrentTarifa({
                    id: '', nombre: '', vueltas: '', tiempo: '', 
                    preciosRegulares: 0, duracionTotal: ''
                  });
                  setIsEditing(false);
                  setOpenDialog(true);
                }}
                fullWidth
              >
                Agregar Tarifa
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RefreshIcon />}
                onClick={fetchTarifas}
                fullWidth
              >
                Recargar
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                color="info"
                startIcon={<AttachMoneyIcon />}
                onClick={() => setMultiplierDialogOpen(true)}
                fullWidth
              >
                Multiplicador Fin de Semana
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                color="warning"
                startIcon={<InitializeIcon />}
                onClick={handleInitializeRates}
                fullWidth
              >
                Inicializar Tarifas
              </Button>
            </Grid>
          </Grid>

          {/* Tabla de tarifas regulares */}
          {loading ? (
            <div className="loading-container">
              <CircularProgress aria-label="Cargando tarifas" />
            </div>
          ) : error ? (
            <Alert severity="error" className="error-alert">
              {error}
            </Alert>
          ) : (
            <TableContainer component={Paper} className="table-container" elevation={3}>
              <Table aria-label="Tabla de tarifas">
                <TableHead>
                  <TableRow className="table-header">
                    <TableCell>Nombre</TableCell>
                    <TableCell align="right">Vueltas</TableCell>
                    <TableCell align="right">Tiempo</TableCell>
                    <TableCell align="right">Precio Regular</TableCell>
                    <TableCell align="right">Duración Total</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tarifas.map((tarifa) => (
                    <TableRow key={tarifa.id} hover className="table-row">
                      <TableCell component="th" scope="row">
                        {tarifa.nombre}
                      </TableCell>
                      <TableCell align="right">{tarifa.vueltas}</TableCell>
                      <TableCell align="right">{tarifa.tiempo}</TableCell>
                      <TableCell align="right">${tarifa.preciosRegulares.toFixed(2)}</TableCell>
                      <TableCell align="right">{tarifa.duracionTotal}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() => {
                              setCurrentTarifa(tarifa);
                              setIsEditing(true);
                              setOpenDialog(true);
                            }}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => {
                              if (window.confirm('¿Eliminar esta tarifa?')) {
                                tarifasService.remove(tarifa.id)
                                  .then(() => {
                                    showSnackbar('Tarifa eliminada', 'success');
                                    fetchTarifas();
                                  })
                                  .catch(err => {
                                    showSnackbar('Error al eliminar tarifa', 'error');
                                  });
                              }
                            }}
                            color="secondary"
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
        </>
      ) : (
        <>
          {/* Controles para tarifas especiales */}
          <Grid container spacing={2} className="controls-container" sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateEspecial}
                fullWidth
              >
                Agregar Especial
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RefreshIcon />}
                onClick={fetchTarifasEspeciales}
                fullWidth
              >
                Recargar
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                color="warning"
                startIcon={<InitializeIcon />}
                onClick={handleInitializeEspecial}
                fullWidth
              >
                Inicializar Especiales
              </Button>
            </Grid>
          </Grid>

          {/* Tabla de tarifas especiales */}
          {loadingEspecial ? (
            <div className="loading-container">
              <CircularProgress aria-label="Cargando tarifas especiales" />
            </div>
          ) : (
            <TableContainer component={Paper} className="table-container" elevation={3} sx={{ mt: 2 }}>
              <Table aria-label="Tabla de tarifas especiales">
                <TableHead>
                  <TableRow className="table-header">
                    <TableCell>Nombre</TableCell>
                    <TableCell align="center">Día</TableCell>
                    <TableCell align="center">Mes</TableCell>
                    <TableCell align="right">Vueltas</TableCell>
                    <TableCell align="right">Tiempo</TableCell>
                    <TableCell align="right">Duración</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tarifasEspeciales.map((tarifa) => (
                    <TableRow key={`especial-${tarifa.id}`} hover>
                      <TableCell>{tarifa.nombre}</TableCell>
                      <TableCell align="center">{tarifa.dia}</TableCell>
                      <TableCell align="center">{tarifa.mes}</TableCell>
                      <TableCell align="right">{tarifa.vueltas}</TableCell>
                      <TableCell align="right">{tarifa.tiempo}</TableCell>
                      <TableCell align="right">{tarifa.duracion}</TableCell>
                      <TableCell align="right">${tarifa.preciosRegulares.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() => handleEditEspecial(tarifa)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => handleDeleteEspecial(tarifa.id)}
                            color="secondary"
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
        </>
      )}

      {/* Diálogos para tarifas regulares */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? 'Editar Tarifa' : 'Crear Nueva Tarifa'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                fullWidth
                value={currentTarifa.nombre}
                onChange={(e) => setCurrentTarifa({ ...currentTarifa, nombre: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Vueltas"
                fullWidth
                value={currentTarifa.vueltas}
                onChange={(e) => setCurrentTarifa({ ...currentTarifa, vueltas: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tiempo"
                fullWidth
                value={currentTarifa.tiempo}
                onChange={(e) => setCurrentTarifa({ ...currentTarifa, tiempo: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Precio Regular"
                type="number"
                fullWidth
                value={currentTarifa.preciosRegulares}
                onChange={(e) => setCurrentTarifa({ 
                  ...currentTarifa, 
                  preciosRegulares: parseFloat(e.target.value) || 0 
                })}
                margin="normal"
                inputProps={{ step: "0.01" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Duración Total"
                fullWidth
                value={currentTarifa.duracionTotal}
                onChange={(e) => setCurrentTarifa({ ...currentTarifa, duracionTotal: e.target.value })}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button 
            onClick={async () => {
              try {
                if (isEditing) {
                  await tarifasService.update(currentTarifa);
                  showSnackbar('Tarifa actualizada', 'success');
                } else {
                  await tarifasService.create(currentTarifa);
                  showSnackbar('Tarifa creada', 'success');
                }
                setOpenDialog(false);
                fetchTarifas();
              } catch (err) {
                showSnackbar(`Error al ${isEditing ? 'actualizar' : 'crear'} tarifa`, 'error');
              }
            }} 
            color="primary" 
            variant="contained"
          >
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para multiplicador de fin de semana */}
      <Dialog open={multiplierDialogOpen} onClose={() => setMultiplierDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Configurar Multiplicador de Fin de Semana</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 3, mb: 4 }}>
            <Typography gutterBottom>
              Multiplicador actual: {weekendMultiplier.toFixed(1)}x
            </Typography>
            <Slider
              value={weekendMultiplier}
              onChange={(e, newValue) => setWeekendMultiplier(newValue)}
              valueLabelDisplay="auto"
              step={0.1}
              marks
              min={1.0}
              max={2.0}
            />
          </Box>
          <TextField
            label="Valor exacto"
            type="number"
            fullWidth
            value={weekendMultiplier}
            onChange={(e) => setWeekendMultiplier(e.target.value === '' ? 1.0 : Number(e.target.value))}
            margin="normal"
            inputProps={{ 
              step: "0.1",
              min: "1.0",
              max: "2.0"
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMultiplierDialogOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button 
            onClick={async () => {
              try {
                await tarifasService.setWeekendMultiplier(weekendMultiplier);
                showSnackbar('Multiplicador aplicado', 'success');
                setMultiplierDialogOpen(false);
                fetchTarifas();
              } catch (err) {
                showSnackbar('Error al aplicar multiplicador', 'error');
              }
            }} 
            color="primary" 
            variant="contained"
          >
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para tarifas especiales */}
      <Dialog open={openDialogEspecial} onClose={() => setOpenDialogEspecial(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEditingEspecial ? 'Editar Tarifa Especial' : 'Crear Tarifa Especial'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                fullWidth
                value={currentEspecial.nombre}
                onChange={(e) => setCurrentEspecial({ ...currentEspecial, nombre: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Día"
                type="number"
                fullWidth
                value={currentEspecial.dia}
                onChange={(e) => setCurrentEspecial({ ...currentEspecial, dia: e.target.value })}
                margin="normal"
                inputProps={{ min: 1, max: 31 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Mes"
                type="number"
                fullWidth
                value={currentEspecial.mes}
                onChange={(e) => setCurrentEspecial({ ...currentEspecial, mes: e.target.value })}
                margin="normal"
                inputProps={{ min: 1, max: 12 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Vueltas"
                fullWidth
                value={currentEspecial.vueltas}
                onChange={(e) => setCurrentEspecial({ ...currentEspecial, vueltas: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tiempo"
                fullWidth
                value={currentEspecial.tiempo}
                onChange={(e) => setCurrentEspecial({ ...currentEspecial, tiempo: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Duración"
                fullWidth
                value={currentEspecial.duracion}
                onChange={(e) => setCurrentEspecial({ ...currentEspecial, duracion: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Precio"
                type="number"
                fullWidth
                value={currentEspecial.preciosRegulares}
                onChange={(e) => setCurrentEspecial({ 
                  ...currentEspecial, 
                  preciosRegulares: parseFloat(e.target.value) || 0 
                })}
                margin="normal"
                inputProps={{ step: "0.01" }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogEspecial(false)} color="secondary">
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmitEspecial}
            color="primary" 
            variant="contained"
          >
            {isEditingEspecial ? 'Actualizar' : 'Crear'}
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
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Tarifas;