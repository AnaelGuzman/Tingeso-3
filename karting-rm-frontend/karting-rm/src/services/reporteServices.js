import httpClient from "../http-common.js";
// Generar reporte por vueltas/tiempo (POST)
const generarReportePorVueltasTiempo = (fechaInicio, fechaFin) => {
  return httpClient.post('/api/reportes/vueltas-tiempo', {
    fechaInicio,
    fechaFin
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Generar reporte por vueltas/tiempo (GET)
const generarReportePorVueltasTiempoGet = (fechaInicio, fechaFin) => {
  return httpClient.get(`/api/reportes/vueltas-tiempo`, {
    params: {
      fechaInicio,
      fechaFin
    }
  });
};

// Generar reporte por número de personas (POST)
const generarReportePorNumeroPersonas = (fechaInicio, fechaFin) => {
  return httpClient.post('/api/reportes/numero-personas', {
    fechaInicio,
    fechaFin
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Generar reporte por número de personas (GET)
const generarReportePorNumeroPersonasGet = (fechaInicio, fechaFin) => {
  return httpClient.get(`/api/reportes/numero-personas`, {
    params: {
      fechaInicio,
      fechaFin
    }
  });
};

// Obtener todos los reportes históricos
const obtenerReportesHistoricos = () => {
  return httpClient.get('/api/reportes/historicos');
};

// Obtener reportes históricos filtrados
const obtenerReportesHistoricosFiltrados = (tipoReporte, fechaInicio, fechaFin) => {
  return httpClient.get(`/api/reportes/historicos/${tipoReporte}`, {
    params: {
      fechaInicio,
      fechaFin
    }
  });
};

// Obtener estadísticas agregadas
const obtenerEstadisticasAgregadas = (tipoReporte, fechaInicio, fechaFin) => {
  return httpClient.get(`/api/reportes/estadisticas/${tipoReporte}`, {
    params: {
      fechaInicio,
      fechaFin
    }
  });
};

// Eliminar reporte específico
const eliminarReporte = (id) => {
  return httpClient.delete(`/api/reportes/${id}`);
};

// Generar reporte completo (ambos tipos)
const generarReporteCompleto = (fechaInicio, fechaFin) => {
  return httpClient.post('/api/reportes/completo', {
    fechaInicio,
    fechaFin
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export default {
  generarReportePorVueltasTiempo,
  generarReportePorVueltasTiempoGet,
  generarReportePorNumeroPersonas,
  generarReportePorNumeroPersonasGet,
  obtenerReportesHistoricos,
  obtenerReportesHistoricosFiltrados,
  obtenerEstadisticasAgregadas,
  eliminarReporte,
  generarReporteCompleto
};