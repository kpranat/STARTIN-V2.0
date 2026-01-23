import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from '../../components/CompanyNavbar';
import { api } from '../../services/api';
import { getCompanyId } from '../../utils/auth';
import '../../App.css'; 

const CompanyPostJob: React.FC = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: '',
    type: 'Internship',
    salary: '',
    description: '',
    requirements: '',
    enddate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const companyId = getCompanyId();
      if (!companyId) {
        setError('Company ID not found. Please login again.');
        setLoading(false);
        return;
      }

      const jobPayload = {
        ...jobData,
        companyid: parseInt(companyId)
      };

      const response = await api.company.postJob(jobPayload);

      if (response.data.success) {
        setSuccess('Job posted successfully!');
        // Reset form
        setJobData({
          title: '',
          type: 'Internship',
          salary: '',
          description: '',
          requirements: '',
          enddate: ''
        });
        
        // Redirect to jobs page after 1.5 seconds
        setTimeout(() => {
          navigate('/company/jobs');
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to post job');
      }
    } catch (err) {
      console.error('Error posting job:', err);
      setError('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CompanyNavbar />
      <div className="page-container">
        <div className="profile-container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', color: '#0f766e' }}>Post a New Job</h2>
          
          {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
          {success && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title</label>
              <input type="text" name="title" value={jobData.title} onChange={handleChange} placeholder="e.g. React Developer Intern" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Job Type</label>
                <select name="type" value={jobData.type} onChange={handleChange} className="search-input" style={{width:'100%'}}>
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div className="form-group">
                <label>Salary (per month)</label>
                <input type="text" name="salary" value={jobData.salary} onChange={handleChange} placeholder="e.g. ₹15,000 or $500" required />
              </div>
            </div>

            <div className="form-group">
              <label>Application Deadline</label>
              <input type="datetime-local" name="enddate" value={jobData.enddate} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Job Description</label>
              <textarea name="description" value={jobData.description} onChange={handleChange} rows={5} placeholder="Describe the role responsibilities..." required></textarea>
            </div>

            <div className="form-group">
              <label>Requirements</label>
              <textarea name="requirements" value={jobData.requirements} onChange={handleChange} rows={3} placeholder="Skills needed (e.g. Java, Python)..." required></textarea>
            </div>

            <div className="btn-save-container">
              <button type="submit" className="btn-save" style={{ backgroundColor: '#0f766e' }} disabled={loading}>
                {loading ? 'Posting Job...' : 'Post Job'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
};

export default CompanyPostJob;