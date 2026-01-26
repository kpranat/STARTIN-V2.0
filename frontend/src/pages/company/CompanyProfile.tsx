import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CompanyNavbar from '../../components/CompanyNavbar';
import { getCompanyId } from '../../utils/auth';
import { api } from '../../services/api';
import '../../App.css'; 

const CompanyProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSetupMode = location.pathname === '/company/profile-setup';
  
  const [isEditing, setIsEditing] = useState(isSetupMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [companyData, setCompanyData] = useState({
    name: '',
    website: '',
    about: '',
    location: ''
  });

  // Mock Data: Previous jobs posted by this company
  const [previousJobs, setPreviousJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  // Load from backend on mount (for edit mode)
  useEffect(() => {
    const loadProfile = async () => {
      if (!isSetupMode) {
        try {
          const companyId = getCompanyId();
          if (companyId) {
            const response = await api.company.checkProfile(companyId);
            if (response.data.success && response.data.hasProfile) {
              const profile = response.data.profile;
              setCompanyData({
                name: profile.name || '',
                website: profile.website || '',
                about: profile.about || '',
                location: profile.location || ''
              });
              setIsEditing(false);
            }
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };

    loadProfile();
  }, [isSetupMode]);

  // Load company jobs
  useEffect(() => {
    const loadJobs = async () => {
      if (!isSetupMode) {
        try {
          setJobsLoading(true);
          const companyId = getCompanyId();
          if (companyId) {
            const response = await api.company.getJobs({ company_id: companyId });
            if (response.data.success) {
              setPreviousJobs(response.data.data);
            }
          }
        } catch (error) {
          console.error('Error loading jobs:', error);
        } finally {
          setJobsLoading(false);
        }
      }
    };

    loadJobs();
  }, [isSetupMode]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
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

      const payload = {
        company_id: companyId,
        name: companyData.name,
        website: companyData.website,
        location: companyData.location,
        about: companyData.about
      };

      if (isSetupMode) {
        // Setup new profile
        await api.company.setupProfile(payload);
        setSuccess('Profile created successfully!');
        setTimeout(() => {
          navigate('/company/home');
        }, 1500);
      } else {
        // Update existing profile
        await api.company.updateProfile(payload);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
      
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CompanyNavbar />
      <div className="page-container">
        <div className="profile-container">
          
          {isEditing ? (
            /* EDIT FORM */
            <>
              <h2>{isSetupMode ? 'Setup Company Profile' : 'Edit Company Profile'}</h2>
              
              {error && (
                <div style={{ 
                  background: '#fee', 
                  color: '#c33', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  marginBottom: '15px' 
                }}>
                  {error}
                </div>
              )}
              
              {success && (
                <div style={{ 
                  background: '#d1fae5', 
                  color: '#065f46', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  marginBottom: '15px' 
                }}>
                  {success}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Company Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={companyData.name} 
                    onChange={handleChange} 
                    placeholder="e.g. TechCorp Solutions" 
                    required 
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Website *</label>
                  <input 
                    type="text" 
                    name="website" 
                    value={companyData.website} 
                    onChange={handleChange} 
                    placeholder="https://..." 
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={companyData.location} 
                    onChange={handleChange} 
                    placeholder="e.g. Bangalore, India" 
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>About the Company *</label>
                  <textarea 
                    name="about" 
                    value={companyData.about} 
                    onChange={handleChange} 
                    rows={4} 
                    placeholder="We are a leading tech firm..."
                    required
                    disabled={loading}
                  ></textarea>
                </div>

                <div className="btn-save-container">
                  <button 
                    type="submit" 
                    className="btn-save"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (isSetupMode ? 'Create Profile' : 'Save Changes')}
                  </button>
                  {!isSetupMode && (
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)} 
                      className="btn-edit"
                      style={{ marginLeft: '10px' }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  )}
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
                <span className="view-label">Location</span>
                <p className="view-content">{companyData.location || "No location added."}</p>
              </div>

              <div className="view-section">
                <span className="view-label">About</span>
                <p className="view-content">{companyData.about || "No description added."}</p>
              </div>

              {/* Previous Jobs Section */}
              <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <h3>Previous Job Listings</h3>
                {jobsLoading ? (
                  <p>Loading jobs...</p>
                ) : previousJobs.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {previousJobs.map((job: any) => (
                      <div key={job.id} style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{job.title}</strong>
                          <div style={{ fontSize: '0.85rem', color: '#666' }}>Posted: {new Date(job.enddate).toLocaleDateString()}</div>
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
                ) : (
                  <p>No jobs posted yet.</p>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyProfile;