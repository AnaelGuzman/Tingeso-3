import httpClient from "../http-common.js";

const getAll = () => {
  return httpClient.get('/api/descuentos-frecuencia');
};

const getById = id => {
  return httpClient.get(`/api/descuentos-frecuencia/${id}`);
};

const deleteById = id => {
  return httpClient.delete(`/api/descuentos-frecuencia/${id}`);
};

const asignarDescuento = (userId, reservaId) => {
  return httpClient.post(`/api/descuentos-frecuencia/asignar?userId=${userId}&reservaId=${reservaId}`);
};

export default {
  getAll,
  getById,
  deleteById,
  asignarDescuento
};
