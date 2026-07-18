import api from './api';

export const applyForJob = (jobId, resumeLink) =>
  api.post(`/applications/jobs/${jobId}`, { resumeLink }).then(res => res.data);

export const getMyApplications = () => api.get('/applications/my').then(res => res.data);
export const getAllApplications = () => api.get('/applications/all').then(res => res.data);
export const updateApplicationStatus = (id, status) =>
  api.patch(`/applications/${id}/status`, { status }).then(res => res.data);
