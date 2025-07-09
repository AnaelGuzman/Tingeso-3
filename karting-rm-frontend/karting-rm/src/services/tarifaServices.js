// tarifasServices.js
import httpClient from "../http-common.js";

const getAll = () => {
    return httpClient.get('/api/v1/tarifas');
};

const getById = (id) => {
    return httpClient.get(`/api/v1/tarifas/${id}`);
};

const create = (data) => {
    return httpClient.post('/api/v1/tarifas', data);
};

const update = (data) => {
  return httpClient.put(`/api/v1/tarifas/${data.id}`, data);
};

const remove = (id) => {
  return httpClient.delete(`/api/v1/tarifas/${id}`);
};

const setWeekendMultiplier = (mul) => {
    return httpClient.get(`/api/v1/tarifas/turn/weekend/${mul}`);
};

const initializeRates = () => {
    return httpClient.post('/api/v1/tarifas/inicializar');
};

export default { 
    getAll, 
    getById, 
    create, 
    update, 
    remove,
    setWeekendMultiplier,
    initializeRates
};