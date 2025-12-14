import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 1. Import useNavigate
import '../App.css';

const CompanyLogin: React.FC = () => {
  const navigate = useNavigate(); // 2. Initialize the hook

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Simulate Backend Login
    console.log("Login Data:", formData);
    
    // Save a fake token so the Navbar knows we are logged in
    localStorage.setItem('companyToken', 'demo-token');

    alert("Login Successful! Redirecting...");
    
    // 3. THIS WAS MISSING -> Redirect to the Company Profile
    navigate('/company/profile');
  };

  return (
    <div className="landing-container">
      <div className="form-container card">
        <h2 style={{ marginBottom: '20px', color: '#0f766e' }}>Company Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <input 
              type="email" 
              name="email" 
              placeholder="company@example.com" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="btn" style={{ backgroundColor: '#0f766e', width: '100%' }}>
            Login
          </button>
        </form>
        <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          New Company? <Link to="/company/signup" className="link">Register Here</Link>
        </p>
      </div>
    </div>
  );
};

export default CompanyLogin;