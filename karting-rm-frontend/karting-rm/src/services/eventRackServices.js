import httpClient from "../http-common.js";

const getAllEvents = () => {
  return httpClient.get('/api/eventos-rack');
};

const getEventById = id => {
  return httpClient.get(`/api/eventos-rack/${id}`);
};

const createEvent = data => {
  return httpClient.post('/api/eventos-rack', data);
};

const updateEvent = (id, data) => {
  return httpClient.put(`/api/eventos-rack/${id}`, data);
};

const deleteEvent = id => {
  return httpClient.delete(`/api/eventos-rack/${id}`);
};

const createEventFromReservation = async (idReserva) => {
  try {
    return await httpClient.post(`/api/eventos-rack/from-reserva/${idReserva}`);
  } catch (error) {
    // Mejor manejo de errores específicos
    if (error.response && error.response.status === 409) {
      throw new Error('Ya existe un evento para esta reserva');
    }
    throw error;
  }
};

const checkEventAvailability = (fecha, horaInicio, horaFin, excludeId = null) => {
  const params = {
    fecha: fecha,
    horaInicio: horaInicio,
    horaFin: horaFin
  };
  
  if (excludeId) {
    params.excludeId = excludeId;
  }
  
  return httpClient.get('/api/eventos-rack/check-availability', { params });
};

const checkReservationHasEvent = idReserva => {
  return httpClient.get(`/api/eventos-rack/reserva/${idReserva}`);
};

const getEventsByDateRange = (startDate, endDate) => {
  return httpClient.get(`/api/eventos-rack/range?start=${startDate}&end=${endDate}`);
};

const getEventsByReservationId = idReserva => {
  return httpClient.get(`/api/eventos-rack/reserva/${idReserva}`);
};

export default {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  createEventFromReservation,
  checkEventAvailability,
  checkReservationHasEvent,
  getEventsByDateRange,
  getEventsByReservationId
};