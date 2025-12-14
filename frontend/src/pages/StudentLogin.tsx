import { useState } from 'react';
import { connectToBackend } from '../services/api'; // Import the connector
import { Link } from 'react-router-dom';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // CALL THE BACKEND HERE
    connectToBackend('student_login', { email, password });
  };

  return (
    <div className="container form-container">
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Student Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit" className="btn">Login</button>
      </form>
      <p>Don't have an account? <Link to="/student/signup">Sign Up</Link></p>
    </div>
  );
};

export default StudentLogin;