import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

export const getPatients = () => API.get('/patients');
export const getPatient = (id) => API.get(`/patients/${id}`);
export const createPatient = (data) => API.post('/patients', data);

export const getGlygemies = (patientId) => API.get(`/glycemies/patient/${patientId}`);
export const ajouterGlygemie = (data) => API.post('/glycemies', data);
export const updateGlygemie = (id, data) => API.put(`/glycemies/${id}`, data);
export const deleteGlygemie = (id) => API.delete(`/glycemies/${id}`);

export default API;