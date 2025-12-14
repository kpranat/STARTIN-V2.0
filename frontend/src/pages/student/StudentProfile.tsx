import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import '../../App.css'; 

const StudentProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '', 
    about: '', 
    skills: '', 
    github: '', 
    linkedin: ''
  });
  
  // We store the file name separately for persistence simulation
  const [resumeName, setResumeName] = useState<string>(""); 

  // 1. LOAD DATA ON COMPONENT MOUNT
  useEffect(() => {
    // Check if profile data exists in browser storage
    const savedData = localStorage.getItem('studentProfile');
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      
      // If we have a resume name saved, load that too
      const savedResume = localStorage.getItem('studentResumeName');
      if (savedResume) setResumeName(savedResume);

      // If data exists, go straight to View Mode
      setIsEditing(false);
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeName(file.name);
      // Note: We can't easily save the actual File object in localStorage, 
      // so we just save the name to simulate it.
      localStorage.setItem('studentResumeName', file.name);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // 2. SAVE DATA TO LOCAL STORAGE
    localStorage.setItem('studentProfile', JSON.stringify(formData));
    
    setIsEditing(false); 
    alert("Profile saved successfully!");
  };

  return (
    <>
      <StudentNavbar />
      <div className="page-container">
        <div className="profile-container">
          
          {isEditing ? (
            /* ================= EDIT MODE ================= */
            <>
              <h2>Setup Your Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    placeholder="e.g. Jane Doe" 
                    onChange={handleInputChange} 
                    required
                  />
                </div>

                <div className="form-group">
                  <label>About Me</label>
                  <textarea 
                    name="about" 
                    value={formData.about}
                    placeholder="I am a passionate developer..." 
                    onChange={handleInputChange}
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
                  />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>GitHub</label>
                        <input 
                          type="text" 
                          name="github" 
                          value={formData.github}
                          placeholder="github.com/..." 
                          onChange={handleInputChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label>LinkedIn</label>
                        <input 
                          type="text" 
                          name="linkedin" 
                          value={formData.linkedin}
                          placeholder="linkedin.com/..." 
                          onChange={handleInputChange} 
                        />
                    </div>
                </div>

                <div className="form-group">
                  <label>Upload Resume (PDF)</label>
                  <div className="file-upload-box">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileChange} 
                    />
                    {resumeName && <p style={{marginTop: '10px', color: 'green', fontSize: '0.9rem'}}>Selected: {resumeName}</p>}
                  </div>
                </div>

                <div className="btn-save-container">
                  <button type="submit" className="btn-save">Save Profile</button>
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