import httpClient from "../http-common.js";

const getAll = () => {
  return httpClient.get('/api/v1/usuarios');
};

const getById = (id) => {
  return httpClient.get(`/api/v1/usuarios/id/${id}`);
};

const getByRut = (rut) => {
  return httpClient.get(`/api/v1/usuarios/rut/${rut}`);
};

const create = (data) => {
  return httpClient.post('/api/v1/usuarios', data);
};

const update = (id, data) => {
  return httpClient.put(`/api/v1/usuarios/${id}`, data);
};

const remove = (id) => {
  return httpClient.delete(`/api/v1/usuarios/id/${id}`);
};

const reinciarVisitas = () => {
  return httpClient.put('/api/v1/usuarios/reiniciar-visitas');
};

const initializeUsers = () => {
  return httpClient.post('/api/v1/usuarios/inicializar');
};

export default {
  getAll,
  getById,
  getByRut,
  create,
  update,
  remove,
  reinciarVisitas,
  initializeUsers
};