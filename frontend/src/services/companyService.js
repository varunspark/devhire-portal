import api from './api';

export const getCompanies = () => api.get('/companies').then(res => res.data);
export const getCompany = (id) => api.get(`/companies/${id}`).then(res => res.data);
export const createCompany = (data) => api.post('/companies', data).then(res => res.data);
export const updateCompany = (id, data) => api.put(`/companies/${id}`, data).then(res => res.data);
export const deleteCompany = (id) => api.delete(`/companies/${id}`).then(res => res.data);
