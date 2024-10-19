import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';


/**
 * Signup is a React component that provides an interface for users to register an account in the application.
 * It collects user data through a form, sends it to the backend server for registration, and handles the server's responses.
 * The component allows users to enter their username, password, and an instrument they play.
 */
const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    instrument: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup', formData);
      if (response.data === 'exist') {
        setErrorMessage('User already exists');
      } else if (response.data === 'user created') {
        navigate('/login');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            id="username"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            id="password"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="instrument">Instrument</label>
          <input
            type="text"
            name="instrument"
            placeholder="Instrument"
            value={formData.instrument}
            onChange={handleChange}
            id="instrument"
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
      <div className="login-redirect">
        <p>Already have an account?</p>
        <button onClick={() => navigate('/login')} className="redirect-btn">Go to Login</button>
      </div>
    </div>
  );
};

export default Signup;
