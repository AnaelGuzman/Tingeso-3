// tarifasEspecialesService.js
import httpClient from "../http-common.js";

const getAll = () => {
  return httpClient.get("/api/v1/tarifas-especiales");
};

const getById = (id) => {
  return httpClient.get(`/api/v1/tarifas-especiales/${id}`);
};

const getByDate = (dia, mes) => {
  return httpClient.get(`/api/v1/tarifas-especiales/buscar?dia=${dia}&mes=${mes}`);
};

const create = (data) => {
  return httpClient.post("/api/v1/tarifas-especiales", data);
};

const update = (data) => {
  return httpClient.put(`/api/v1/tarifas-especiales/${data.id}`, data);
};

const remove = (id) => {
  return httpClient.delete(`/api/v1/tarifas-especiales/${id}`);
};

const initializeRates = () => {
  return httpClient.post("/api/v1/tarifas-especiales/inicializar");
};

export default {
  getAll,
  getById,
  getByDate,
  create,
  update,
  remove,
  initializeRates
};
