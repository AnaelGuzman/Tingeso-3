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
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  BarChart as BarChartIcon,
  People as PeopleIcon,
  Timer as TimerIcon,
  HelpOutline as HelpIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ReporteServices from '../services/reporteServices';
import './Reportes.css';
import Navbar from '../componentes/Navbar';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reporte-tabpanel-${index}`}
      aria-labelledby={`reporte-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Reportes = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [reporteCompleto, setReporteCompleto] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reporteDetalle, setReporteDetalle] = useState(null);

  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value || 0);
  };

  // Generar ambos reportes
  const generarReportes = async () => {
    if (!fechaInicio || !fechaFin) {
      setSnackbar({
        open: true,
        message: 'Debe seleccionar ambas fechas',
        severity: 'warning'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await ReporteServices.generarReporteCompleto(fechaInicio, fechaFin);
      setReporteCompleto(response.data);
      setSnackbar({
        open: true,
        message: 'Reportes generados exitosamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generando reportes:', error);
      setSnackbar({
        open: true,
        message: 'Error al generar reportes: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Ver detalles del reporte
  const handleVerDetalles = (reporte) => {
    setReporteDetalle(reporte);
    setDialogOpen(true);
  };

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Manejar cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="reportes-container">
      <Navbar/> 
      {/* Hero Section */}
      <div className="reportes-hero">
        <Typography variant="h2" component="h1" className="hero-title">
          REPORTES DE INGRESOS
        </Typography>
        <Typography variant="h5" className="hero-subtitle">
          Analiza el desempeño financiero de KartingRM
        </Typography>
      </div>

      <Container maxWidth="lg" className="main-content">
        {/* Filtros */}
        <Card sx={{ mb: 3 }} className="filtros-card">
          <CardContent>
            <Typography variant="h6" gutterBottom className="section-title">
              <DateRangeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Seleccione el rango de fechas
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Fecha Inicio"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Fecha Fin"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={generarReportes}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                >
                  Generar Reportes
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setFechaInicio('');
                    setFechaFin('');
                    setReporteCompleto(null);
                  }}
                  disabled={loading}
                >
                  Limpiar Filtros
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Por Vueltas/Tiempo" icon={<TimerIcon />} />
            <Tab label="Por Número de Personas" icon={<PeopleIcon />} />
            <Tab label="Resumen" icon={<BarChartIcon />} />
          </Tabs>
        </Paper>

        {/* Contenido */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* Pestaña Vueltas/Tiempo */}
            <TabPanel value={tabValue} index={0}>
              {reporteCompleto?.vueltasTiempo ? (
                <Card className="reporte-card">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <TimerIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" className="section-title">
                        Reporte por Vueltas/Tiempo ({fechaInicio} a {fechaFin})
                      </Typography>
                    </Box>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Categoría</TableCell>
                            <TableCell align="right">Reservas</TableCell>
                            <TableCell align="right">Ingreso Bruto</TableCell>
                            <TableCell align="right">Ingreso Neto</TableCell>
                            <TableCell align="right">IVA</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">% del Total</TableCell>
                            <TableCell>Acciones</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reporteCompleto.vueltasTiempo.detalles.map((reporte, index) => (
                            <TableRow key={index}>
                              <TableCell>{reporte.categoria}</TableCell>
                              <TableCell align="right">{reporte.cantidadReservas}</TableCell>
                              <TableCell align="right">{formatCurrency(reporte.ingresoBruto)}</TableCell>
                              <TableCell align="right">{formatCurrency(reporte.ingresoNeto)}</TableCell>
                              <TableCell align="right">{formatCurrency(reporte.ingresoIva)}</TableCell>
                              <TableCell align="right">{formatCurrency(reporte.ingresoTotal)}</TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={`${reporte.porcentajeDelTotal}%`} 
                                  color="primary" 
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  onClick={() => handleVerDetalles(reporte)}
                                >
                                  Detalles
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={5} align="right"><strong>Total General:</strong></TableCell>
                            <TableCell align="right">
                              <strong>{formatCurrency(reporteCompleto.vueltasTiempo.ingresoTotalPeriodo)}</strong>
                            </TableCell>
                            <TableCell align="right">
                              <Chip label="100%" color="primary" />
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="textSecondary">
                    Seleccione un rango de fechas y genere el reporte
                  </Typography>
                </Box>
              )}
            </TabPanel>

            {/* Pestaña Número de Personas */}
            <TabPanel value={tabValue} index={1}>
              {reporteCompleto?.numeroPersonas ? (
                <Card className="reporte-card">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <PeopleIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" className="section-title">
                        Reporte por Número de Personas ({fechaInicio} a {fechaFin})
                      </Typography>
                    </Box>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Grupo</TableCell>
                            <TableCell align="right">Reservas</TableCell>
                            <TableCell align="right">Ingreso Bruto</TableCell>
                            <TableCell align="right">Ingreso Neto</TableCell>
                            <TableCell align="right">IVA</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">% del Total</TableCell>
                            <TableCell>Acciones</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reporteCompleto.numeroPersonas.detalles.map((reporte, index) => (
                            <TableRow key={index}>
                              <TableCell>{reporte.categoria}</TableCell>
                              <TableCell align="right">{reporte.cantidadReservas}</TableCell>
                              <TableCell align="right">{formatCurrency(reporte.ingresoBruto)}</TableCell>
                              <TableCell align="right">{formatCurrency(reporte.ingresoNeto)}</TableCell>
                              <TableCell align="right">{formatCurrency(reporte.ingresoIva)}</TableCell>
                              <TableCell align="right">{formatCurrency(reporte.ingresoTotal)}</TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={`${reporte.porcentajeDelTotal}%`} 
                                  color="primary" 
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  onClick={() => handleVerDetalles(reporte)}
                                >
                                  Detalles
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={5} align="right"><strong>Total General:</strong></TableCell>
                            <TableCell align="right">
                              <strong>{formatCurrency(reporteCompleto.numeroPersonas.ingresoTotalPeriodo)}</strong>
                            </TableCell>
                            <TableCell align="right">
                              <Chip label="100%" color="primary" />
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="textSecondary">
                    Seleccione un rango de fechas y genere el reporte
                  </Typography>
                </Box>
              )}
            </TabPanel>

            {/* Pestaña Resumen */}
            <TabPanel value={tabValue} index={2}>
              {reporteCompleto ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card className="reporte-card">
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <TimerIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6" className="section-title">
                            Resumen Vueltas/Tiempo
                          </Typography>
                        </Box>
                        <TableContainer component={Paper}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Categoría</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell align="right">%</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {reporteCompleto.vueltasTiempo.detalles.map((reporte, index) => (
                                <TableRow key={index}>
                                  <TableCell>{reporte.categoria}</TableCell>
                                  <TableCell align="right">{formatCurrency(reporte.ingresoTotal)}</TableCell>
                                  <TableCell align="right">
                                    <Chip 
                                      label={`${reporte.porcentajeDelTotal}%`} 
                                      color="primary" 
                                      size="small"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell><strong>Total:</strong></TableCell>
                                <TableCell align="right">
                                  <strong>{formatCurrency(reporteCompleto.vueltasTiempo.ingresoTotalPeriodo)}</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <Chip label="100%" color="primary" size="small" />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card className="reporte-card">
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <PeopleIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6" className="section-title">
                            Resumen Número de Personas
                          </Typography>
                        </Box>
                        <TableContainer component={Paper}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Grupo</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell align="right">%</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {reporteCompleto.numeroPersonas.detalles.map((reporte, index) => (
                                <TableRow key={index}>
                                  <TableCell>{reporte.categoria}</TableCell>
                                  <TableCell align="right">{formatCurrency(reporte.ingresoTotal)}</TableCell>
                                  <TableCell align="right">
                                    <Chip 
                                      label={`${reporte.porcentajeDelTotal}%`} 
                                      color="primary" 
                                      size="small"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell><strong>Total:</strong></TableCell>
                                <TableCell align="right">
                                  <strong>{formatCurrency(reporteCompleto.numeroPersonas.ingresoTotalPeriodo)}</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <Chip label="100%" color="primary" size="small" />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="textSecondary">
                    Seleccione un rango de fechas y genere el reporte
                  </Typography>
                </Box>
              )}
            </TabPanel>
          </>
        )}

        {/* Botón de volver */}
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Volver
          </Button>
        </Box>
      </Container>

      {/* Diálogo de detalles */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles del Reporte</DialogTitle>
        <DialogContent>
          {reporteDetalle && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Categoría:</strong> {reporteDetalle.categoria}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Reservas:</strong> {reporteDetalle.cantidadReservas}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Porcentaje:</strong> {reporteDetalle.porcentajeDelTotal}%
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Ingreso Bruto:</strong>
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(reporteDetalle.ingresoBruto)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Ingreso Neto:</strong>
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(reporteDetalle.ingresoNeto)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>IVA:</strong>
                </Typography>
                <Typography variant="h6" color="secondary">
                  {formatCurrency(reporteDetalle.ingresoIva)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Total:</strong>
                </Typography>
                <Typography variant="h5" color="success.main">
                  {formatCurrency(reporteDetalle.ingresoTotal)}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Reportes;