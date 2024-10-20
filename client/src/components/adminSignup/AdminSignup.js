import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminSignup.css'; 

/**
 * AdminSignup is a React component for rendering an admin registration form.
 * This component handles the registration of an admin user by sending their credentials to a backend server.
 * Upon successful registration, it navigates to the admin login page or dashboard.
 * If the registration fails, it displays an error message.
 */
const AdminSignup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        instrument: '',
        role: 'admin'
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(process.env.REACT_APP_API_URL);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/signup`, formData);
            if (response.data.message === 'admin created') {
                navigate('/admin/login');
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage('Failed to register. Please try again later.');
        }
    };

    const handleNavigateToLogin = () => {
        navigate('/admin/login');
    };

    return (
        <div className="admin-signup-container">
            <h1>Admin Signup</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="instrument">Instrument</label>
                    <select
                        id="instrument"
                        name="instrument"
                        value={formData.instrument}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select your role</option> 
                        <option value="singer">Singer</option>
                        <option value="drums">Drums</option>
                        <option value="guitar">Guitar</option>
                        <option value="bass">Bass</option>
                        <option value="saxophone">Saxophone</option>
                        <option value="keyboards">Keyboards</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit" className="signup-btn">Sign Up</button>
                <p className="login-link" onClick={handleNavigateToLogin}>Already have an admin account? Login</p>
            </form>
        </div>
    );
};

export default AdminSignup;
