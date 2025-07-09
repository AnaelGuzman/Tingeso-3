import httpClient from "../http-common.js";

const getAll = () => {
  return httpClient.get('/api/descuentos-grupales');
};

const getById = id => {
  return httpClient.get(`/api/descuentos-grupales/${id}`);
};

const deleteById = id => {
  return httpClient.delete(`/api/descuentos-grupales/${id}`);
};

const asignarDescuento = (userId, tamanioGrupo) => {
  return httpClient.post(`/api/descuentos-grupales/asignar?userId=${userId}&tamanioGrupo=${tamanioGrupo}`);
};

export default {
  getAll,
  getById,
  deleteById,
  asignarDescuento
};