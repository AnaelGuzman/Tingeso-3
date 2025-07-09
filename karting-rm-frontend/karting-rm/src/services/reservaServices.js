import httpClient from "../http-common.js";

const getAll = () => {
  return httpClient.get('/reservas');
};

const getById = id => {
  return httpClient.get(`/reservas/${id}`);
};

const create = data => {
  return httpClient.post('/reservas', data);
};

const update = (id, data) => {
  return httpClient.put(`/reservas/${id}`, data);
};

const deleteById = id => {
  return httpClient.delete(`/reservas/${id}`);
};

const deleteByObject = reserva => {
  return httpClient.delete('/reservas', { data: reserva });
};

// Métodos para tarifas
const asignarTarifaGeneral = (idReserva, idTarifa) => {
  return httpClient.post(`/reservas/${idReserva}/tarifa-general/${idTarifa}`);
};

const asignarTarifaEspecial = (idReserva, idTarifaEspecial) => {
  return httpClient.post(`/reservas/${idReserva}/tarifa-especial/${idTarifaEspecial}`);
};

// Métodos para participantes
const agregarParticipante = (idReserva, idUsuario) => {
  return httpClient.post(`/reservas/${idReserva}/participantes/${idUsuario}`);
};

const eliminarParticipante = (idReserva, idUsuario) => {
  return httpClient.delete(`/reservas/${idReserva}/participantes/${idUsuario}`);
};

// Método para cálculo de valores
const calcularValoresReserva = idReserva => {
  return httpClient.post(`/reservas/${idReserva}/calcular`);
};

const generarComprobante = (idReserva) => {
    return httpClient.get(`/reservas/reservation/${idReserva}/comprobante`, {
        responseType: 'blob' // Importante para manejar archivos PDF
    });
};

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
  deleteByObject,
  asignarTarifaGeneral,
  asignarTarifaEspecial,
  agregarParticipante,
  eliminarParticipante,
  calcularValoresReserva,
  generarComprobante
};