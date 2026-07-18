import api from './api';

export const getJobs = () => api.get('/jobs').then(res => res.data);
export const getAllJobsAdmin = () => api.get('/jobs/all').then(res => res.data);
export const getJob = (id) => api.get(`/jobs/${id}`).then(res => res.data);
export const createJob = (data) => api.post('/jobs', data).then(res => res.data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data).then(res => res.data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`).then(res => res.data);
