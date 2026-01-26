import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StudentNavbar from '../../components/StudentNavbar';
import { getStudentId } from '../../utils/auth';
import { api } from '../../services/api';
import '../../App.css'; 

const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSetupMode = location.pathname === '/student/profile-setup';
  
  const [isEditing, setIsEditing] = useState(isSetupMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '', 
    about: '', 
    skills: '', 
    github: '', 
    linkedin: ''
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string>(""); 

  // 1. LOAD DATA ON COMPONENT MOUNT
  useEffect(() => {
    const loadProfile = async () => {
      if (!isSetupMode) {
        try {
          const studentId = getStudentId();
          if (studentId) {
            const response = await api.student.checkProfile(studentId);
            if (response.data.success && response.data.hasProfile) {
              const profile = response.data.profile;
              setFormData({
                fullName: profile.fullName || '',
                about: profile.about || '',
                skills: profile.skills || '',
                github: profile.github || '',
                linkedin: profile.linkedin || ''
              });
              setResumeName(profile.resume || '');
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setResumeName(file.name);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const studentId = getStudentId();
      if (!studentId) {
        setError('Student ID not found. Please login again.');
        setLoading(false);
        return;
      }

      // Create FormData for multipart/form-data submission
      const formDataToSend = new FormData();
      formDataToSend.append('student_id', studentId);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('about', formData.about);
      formDataToSend.append('skills', formData.skills);
      formDataToSend.append('github', formData.github);
      formDataToSend.append('linkedin', formData.linkedin);
      
      // Add resume file if selected
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }

      if (isSetupMode) {
        // Setup new profile
        await api.student.setupProfile(formDataToSend);
        setSuccess('Profile created successfully!');
        setTimeout(() => {
          navigate('/student/home');
        }, 1500);
      } else {
        // Update existing profile
        await api.student.updateProfile(formDataToSend);
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
      <StudentNavbar />
      <div className="page-container">
        <div className="profile-container">
          
          {isEditing ? (
            /* ================= EDIT MODE ================= */
            <>
              <h2>{isSetupMode ? 'Setup Your Profile' : 'Edit Your Profile'}</h2>
              
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
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    placeholder="e.g. Jane Doe" 
                    onChange={handleInputChange} 
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>About Me</label>
                  <textarea 
                    name="about" 
                    value={formData.about}
                    placeholder="I am a passionate developer..." 
                    onChange={handleInputChange}
                    disabled={loading}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Skills</label>
                  <input 
                    type="text" 
                    name="skills" 
                    value={formData.skills}
                    placeholder="Java, Python, React..." 
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>GitHub</label>
                        <input 
                          type="text" 
                          name="github" 
                          value={formData.github}
                          placeholder="github.com/username" 
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>LinkedIn</label>
                        <input 
                          type="text" 
                          name="linkedin" 
                          value={formData.linkedin}
                          placeholder="linkedin.com/in/username" 
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-group">
                  <label>Upload Resume (PDF, DOC, DOCX)</label>
                  <div className="file-upload-box">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                    {resumeName && (
                      <p style={{marginTop: '10px', color: 'green', fontSize: '0.9rem'}}>
                        📄 {resumeName}
                      </p>
                    )}
                  </div>
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
            /* ================= VIEW MODE ================= */
            <div className="profile-view">
              <div className="profile-header">
                <div>
                  <h2 className="profile-name">{formData.fullName || "Your Name"}</h2>
                  <p className="profile-role">Student / Job Seeker</p>
                </div>
                <button onClick={() => setIsEditing(true)} className="btn-edit">
                  Edit Profile
                </button>
              </div>

              <div className="view-section">
                <span className="view-label">About Me</span>
                <p className="view-content">{formData.about || "No description provided."}</p>
              </div>

              <div className="view-section">
                <span className="view-label">Skills</span>
                <p className="view-content">{formData.skills || "No skills listed."}</p>
              </div>

              <div className="view-section">
                <span className="view-label">Professional Links</span>
                <div className="link-group">
                  {formData.github ? (
                    <a href={`https://${formData.github}`} className="profile-link" target="_blank" rel="noreferrer">GitHub</a>
                  ) : <span style={{color:'#ccc'}}>No GitHub</span>}
                  
                  {formData.linkedin ? (
                    <a href={`https://${formData.linkedin}`} className="profile-link" target="_blank" rel="noreferrer">LinkedIn</a>
                  ) : <span style={{color:'#ccc'}}>No LinkedIn</span>}
                </div>
              </div>

              <div className="view-section">
                <span className="view-label">Resume</span>
                <p className="view-content">
                  {resumeName ? `📄 ${resumeName}` : "No resume uploaded."}
                </p>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </>
  );
};

export default StudentProfile;