import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import CompanyNavbar from '../../components/CompanyNavbar';
import '../../App.css'; 

const CompanyProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(true);
  
  const [companyData, setCompanyData] = useState({
    name: '',
    website: '',
    description: '',
    location: ''
  });

  // Mock Data: Previous jobs posted by this company
  const [previousJobs, setPreviousJobs] = useState([
    { id: 1, title: 'Frontend Developer Intern', date: '2023-10-12', status: 'Closed' },
    { id: 2, title: 'Marketing Associate', date: '2023-11-05', status: 'Active' },
  ]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('companyProfile');
    if (saved) {
      setCompanyData(JSON.parse(saved));
      setIsEditing(false);
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // ---------------------------------------------------------
    // BACKEND INTEGRATION: POST /api/company/profile
    // ---------------------------------------------------------
    localStorage.setItem('companyProfile', JSON.stringify(companyData));
    setIsEditing(false);
    alert("Company Profile Saved!");
  };

  return (
    <>
      <CompanyNavbar />
      <div className="page-container">
        <div className="profile-container">
          
          {isEditing ? (
            /* EDIT FORM */
            <>
              <h2>Setup Company Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Company Name</label>
                  <input type="text" name="name" value={companyData.name} onChange={handleChange} placeholder="e.g. TechCorp Solutions" required />
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input type="text" name="website" value={companyData.website} onChange={handleChange} placeholder="https://..." />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input type="text" name="location" value={companyData.location} onChange={handleChange} placeholder="e.g. Bangalore, India" />
                </div>

                <div className="form-group">
                  <label>About the Company</label>
                  <textarea name="description" value={companyData.description} onChange={handleChange} rows={4} placeholder="We are a leading tech firm..."></textarea>
                </div>

                <div className="btn-save-container">
                  <button type="submit" className="btn-save">Save Profile</button>
                </div>
              </form>
            </>
          ) : (
            /* VIEW MODE */
            <div className="profile-view">
              <div className="profile-header">
                <div>
                  <h2 className="profile-name">{companyData.name || "Company Name"}</h2>
                  <a href={companyData.website} target="_blank" rel="noreferrer" style={{color: '#0f766e'}}>{companyData.website}</a>
                </div>
                <button onClick={() => setIsEditing(true)} className="btn-edit">Edit Profile</button>
              </div>

              <div className="view-section">
                <span className="view-label">About</span>
                <p className="view-content">{companyData.description || "No description added."}</p>
              </div>

              {/* Previous Jobs Section */}
              <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <h3>Previous Job Listings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {previousJobs.map(job => (
                    <div key={job.id} style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{job.title}</strong>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>Posted: {job.date}</div>
                      </div>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                        backgroundColor: job.status === 'Active' ? '#d1fae5' : '#e5e7eb',
                        color: job.status === 'Active' ? '#065f46' : '#374151'
                      }}>
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyProfile;