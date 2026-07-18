import React, { useEffect, useState } from 'react';
import { getAllJobsAdmin, createJob, updateJob, deleteJob } from '../services/jobService';
import { getCompanies, createCompany, deleteCompany } from '../services/companyService';
import { getAllApplications, updateApplicationStatus } from '../services/applicationService';

const emptyJob = { title: '', description: '', location: '', salary: '', jobType: 'FULL_TIME', companyId: '' };
const emptyCompany = { name: '', description: '', website: '', location: '' };
const TABS = ['Jobs', 'Companies', 'Applications'];

export default function AdminPanel() {
  const [tab, setTab] = useState('Jobs');
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobForm, setJobForm] = useState(emptyJob);
  const [editingJobId, setEditingJobId] = useState(null);
  const [companyForm, setCompanyForm] = useState(emptyCompany);
  const [message, setMessage] = useState('');

  const refreshAll = () => {
    getAllJobsAdmin().then(setJobs).catch(console.error);
    getCompanies().then(setCompanies).catch(console.error);
    getAllApplications().then(setApplications).catch(console.error);
  };

  useEffect(() => { refreshAll(); }, []);

  const flash = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  // ---- Jobs ----
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...jobForm, salary: jobForm.salary ? Number(jobForm.salary) : null, companyId: Number(jobForm.companyId) };
      if (editingJobId) {
        await updateJob(editingJobId, payload);
        flash('Job updated');
      } else {
        await createJob(payload);
        flash('Job created');
      }
      setJobForm(emptyJob);
      setEditingJobId(null);
      refreshAll();
    } catch (err) {
      flash(err.response?.data?.message || 'Error saving job');
    }
  };

  const startEditJob = (job) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title, description: job.description, location: job.location || '',
      salary: job.salary ?? '', jobType: job.jobType, companyId: job.companyId
    });
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    await deleteJob(id);
    refreshAll();
  };

  // ---- Companies ----
  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      await createCompany(companyForm);
      setCompanyForm(emptyCompany);
      flash('Company created');
      refreshAll();
    } catch (err) {
      flash(err.response?.data?.message || 'Error saving company');
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Delete this company? Its jobs will be deleted too.')) return;
    await deleteCompany(id);
    refreshAll();
  };

  // ---- Applications ----
  const handleStatusChange = async (id, status) => {
    await updateApplicationStatus(id, status);
    refreshAll();
  };

  return (
    <div className="page-container">
      <h1>Admin Panel</h1>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="tabs">
        {TABS.map(t => (
          <button key={t} className={`tab ${tab === t ? 'tab-active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Jobs' && (
        <div className="admin-section">
          <form className="admin-form" onSubmit={handleJobSubmit}>
            <h3>{editingJobId ? 'Edit Job' : 'Post a New Job'}</h3>
            <input placeholder="Title" value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} required />
            <textarea placeholder="Description" value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} required />
            <input placeholder="Location" value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} />
            <input placeholder="Salary" type="number" value={jobForm.salary} onChange={e => setJobForm({ ...jobForm, salary: e.target.value })} />
            <select value={jobForm.jobType} onChange={e => setJobForm({ ...jobForm, jobType: e.target.value })}>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="REMOTE">Remote</option>
            </select>
            <select value={jobForm.companyId} onChange={e => setJobForm({ ...jobForm, companyId: e.target.value })} required>
              <option value="">Select company</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="form-actions">
              <button className="btn btn-primary" type="submit">{editingJobId ? 'Update' : 'Create'} Job</button>
              {editingJobId && <button type="button" className="btn btn-outline" onClick={() => { setEditingJobId(null); setJobForm(emptyJob); }}>Cancel</button>}
            </div>
          </form>

          <table className="table">
            <thead><tr><th>Title</th><th>Company</th><th>Type</th><th>Active</th><th>Actions</th></tr></thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.companyName}</td>
                  <td>{job.jobType}</td>
                  <td>{job.active ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="btn btn-sm" onClick={() => startEditJob(job)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteJob(job.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Companies' && (
        <div className="admin-section">
          <form className="admin-form" onSubmit={handleCompanySubmit}>
            <h3>Add a Company</h3>
            <input placeholder="Name" value={companyForm.name} onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })} required />
            <textarea placeholder="Description" value={companyForm.description} onChange={e => setCompanyForm({ ...companyForm, description: e.target.value })} />
            <input placeholder="Website" value={companyForm.website} onChange={e => setCompanyForm({ ...companyForm, website: e.target.value })} />
            <input placeholder="Location" value={companyForm.location} onChange={e => setCompanyForm({ ...companyForm, location: e.target.value })} />
            <button className="btn btn-primary" type="submit">Create Company</button>
          </form>

          <table className="table">
            <thead><tr><th>Name</th><th>Location</th><th>Website</th><th>Actions</th></tr></thead>
            <tbody>
              {companies.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.location}</td>
                  <td>{c.website}</td>
                  <td><button className="btn btn-sm btn-danger" onClick={() => handleDeleteCompany(c.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Applications' && (
        <div className="admin-section">
          <table className="table">
            <thead><tr><th>Applicant</th><th>Job</th><th>Resume</th><th>Status</th><th>Applied</th></tr></thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>{app.applicantUsername}</td>
                  <td>{app.jobTitle}</td>
                  <td><a href={app.resumeLink} target="_blank" rel="noreferrer">View</a></td>
                  <td>
                    <select value={app.status} onChange={e => handleStatusChange(app.id, e.target.value)}>
                      <option value="APPLIED">Applied</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="HIRED">Hired</option>
                    </select>
                  </td>
                  <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
