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
  Box
} from '@mui/material';
import { CircularProgress } from '@mui/material';
import {
  AttachMoney as TarifaIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import tarifasService from '../services/tarifaServices';
import tarifasEspecialesService from '../services/tarifaEspecialesServices';
import './TarifasCliente.css';
import Navbar from '../componentes/Navbar';

const TarifasCliente = () => {
  const navigate = useNavigate();
  const [tarifas, setTarifas] = useState([]);
  const [tarifasEspeciales, setTarifasEspeciales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTarifas, resEspeciales] = await Promise.all([
          tarifasService.getAll(),
          tarifasEspecialesService.getAll()
        ]);
        setTarifas(resTarifas.data);
        setTarifasEspeciales(resEspeciales.data);
      } catch (error) {
        console.error("Error cargando tarifas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReservarClick = () => {
    navigate('/checkUsers');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="loading-container">
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <div className="tarifas-cliente-container">
      <Navbar/>
      {/* Hero Section */}
      <div className="tarifas-hero">
        <Typography variant="h2" component="h1" className="hero-title">
          NUESTRAS TARIFAS
        </Typography>
        <Typography variant="h5" className="hero-subtitle">
          Elige la experiencia que mejor se adapte a ti
        </Typography>
      </div>

      <Container maxWidth="lg" className="main-content">
        {/* Tabs */}
        <div className="tabs-container">
          <Button
            variant={tabValue === 0 ? "contained" : "outlined"}
            onClick={() => setTabValue(0)}
            startIcon={<TarifaIcon />}
            className="tab-button"
          >
            Tarifas Regulares
          </Button>
          <Button
            variant={tabValue === 1 ? "contained" : "outlined"}
            onClick={() => setTabValue(1)}
            startIcon={<EventIcon />}
            className="tab-button"
          >
            Tarifas Especiales
          </Button>
        </div>

        {tabValue === 0 ? (
          <>
            {/* Tarifas Regulares */}
            <Grid container spacing={4} className="tarifas-grid">
              {tarifas.map((tarifa) => (
                <Grid item xs={12} md={6} lg={4} key={tarifa.id}>
                  <Card className="tarifa-card" elevation={3}>
                    <CardContent>
                      <div className="tarifa-header">
                        <Typography variant="h5" component="h2" className="tarifa-name">
                          {tarifa.nombre}
                        </Typography>
                        <Chip 
                          label="POPULAR" 
                          color="primary" 
                          size="small"
                          className={tarifa.nombre.includes("GENERAL") ? "" : "hidden-chip"}
                        />
                      </div>
                      <Divider className="tarifa-divider" />
                      
                      <div className="tarifa-price">
                        <Typography variant="h4" component="div">
                          ${tarifa.preciosRegulares.toFixed(2)}
                        </Typography>
                        {tarifa.nombre.includes("FIN DE SEMANA") && (
                          <Typography variant="caption" className="weekend-badge">
                            Precio fin de semana
                          </Typography>
                        )}
                      </div>
                      
                      <ul className="tarifa-features">
                        <li>
                          <ScheduleIcon color="primary" className="feature-icon" />
                          <span>{tarifa.duracionTotal} de experiencia</span>
                        </li>
                        <li>
                          <CheckIcon color="primary" className="feature-icon" />
                          <span>{tarifa.vueltas} de adrenalina</span>
                        </li>
                        <li>
                          <CheckIcon color="primary" className="feature-icon" />
                          <span>Tiempo por vuelta: {tarifa.tiempo}</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>
            {/* Tarifas Especiales */}
            <Typography variant="h5" className="especiales-title">
              Eventos y fechas especiales
            </Typography>
            <Grid container spacing={4} className="tarifas-grid">
              {tarifasEspeciales.map((tarifa) => (
                <Grid item xs={12} md={6} lg={4} key={`especial-${tarifa.id}`}>
                  <Card className="especial-card" elevation={3}>
                    <CardContent>
                      <Typography variant="h5" component="h2" className="especial-name">
                        {tarifa.nombre}
                      </Typography>
                      <Typography variant="subtitle1" className="especial-date">
                        {tarifa.dia}/{tarifa.mes}
                      </Typography>
                      
                      <Divider className="tarifa-divider" />
                      
                      <div className="tarifa-price">
                        <Typography variant="h4" component="div">
                          ${tarifa.preciosRegulares.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" className="discount-badge">
                          ¡Precio especial!
                        </Typography>
                      </div>
                      
                      <ul className="tarifa-features">
                        <li>
                          <ScheduleIcon color="secondary" className="feature-icon" />
                          <span>{tarifa.duracion} de diversión</span>
                        </li>
                        <li>
                          <CheckIcon color="secondary" className="feature-icon" />
                          <span>{tarifa.vueltas} emocionantes</span>
                        </li>
                        <li>
                          <CheckIcon color="secondary" className="feature-icon" />
                          <span>Tiempo: {tarifa.tiempo} por vuelta</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* CTA Section */}
        <Box className="cta-section" textAlign="center">
          <Typography variant="h4" className="cta-title">
            ¿Listo para la aventura?
          </Typography>
          <Typography variant="subtitle1" className="cta-subtitle">
            Reserva ahora y asegura tu lugar en la pista
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowIcon />}
            className="reserva-button"
            onClick={handleReservarClick}
          >
            RESERVA YA
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default TarifasCliente;