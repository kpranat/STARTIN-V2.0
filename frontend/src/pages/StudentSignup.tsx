import { useState } from 'react';
import { connectToBackend } from '../services/api';
import { Link, useNavigate } from 'react-router-dom'; 

const StudentSignup = () => {
  const navigate = useNavigate(); 
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send data to backend
    connectToBackend('student_signup', formData);

    // 3. Show feedback and redirect
    
    alert("Signup successful! Redirecting to profile setup...");
    
    // 4. Navigate to the next step
    navigate('/student/profile');
  };

  return (
    <div className="container form-container">
      <h2>Student Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        
        <button type="submit" className="btn">Sign Up</button>
      </form>
      <p>Already registered? <Link to="/student/login">Login</Link></p>
    </div>
  );
};

export default StudentSignup;