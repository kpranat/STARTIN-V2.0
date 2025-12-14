import React, { useState, ChangeEvent, FormEvent } from 'react';
import CompanyNavbar from '../../components/CompanyNavbar';
import '../../App.css'; 

const CompanyPostJob: React.FC = () => {
  const [jobData, setJobData] = useState({
    title: '',
    type: 'Internship',
    stipend: '',
    description: '',
    requirements: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // ---------------------------------------------------------
    // BACKEND INTEGRATION: POST /api/jobs/create
    // ---------------------------------------------------------
    console.log("Job Posted:", jobData);
    alert("Job Posted Successfully!");
    
    // Reset form
    setJobData({ title: '', type: 'Internship', stipend: '', description: '', requirements: '' });
  };

  return (
    <>
      <CompanyNavbar />
      <div className="page-container">
        <div className="profile-container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', color: '#0f766e' }}>Post a New Job</h2>
          
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
                <label>Stipend / Salary (per month)</label>
                <input type="text" name="stipend" value={jobData.stipend} onChange={handleChange} placeholder="e.g. ₹15,000 or $500" />
              </div>
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
              <button type="submit" className="btn-save" style={{ backgroundColor: '#0f766e' }}>Post Job</button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
};

export default CompanyPostJob;