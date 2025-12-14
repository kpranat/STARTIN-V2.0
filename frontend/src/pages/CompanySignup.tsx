import { useState } from 'react';
import { connectToBackend } from '../services/api';
import { Link } from 'react-router-dom';

const CompanySignup = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: ''
  });

  // Updates state whenever a user types in any box
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send data to backend with action 'company_signup'
    connectToBackend('company_signup', formData);
  };

  return (
    <div className="container form-container">
      <h2>Company Registration</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="companyName" 
          placeholder="Company Name" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Official Email" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Create Password" 
          onChange={handleChange} 
          required 
        />
        
        <button type="submit" className="btn">Register Company</button>
      </form>
      
      <p>
        Already have an account? <Link to="/company/login">Login</Link>
      </p>
    </div>
  );
};

export default CompanySignup;