import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios to make HTTP requests
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { login, isLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn && user?.role === 'admin'){
            navigate('/admin');
        }
    });


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://jamoveo-production-ddb9.up.railway.app/admin/login', {
                username,
                password
            });
            if (response.data.message === 'login successful') {
                login({ username: response.data.username, role: response.data.role, instrument: response.data.instrument });
                navigate('/admin');
            } else {
                setErrorMessage(response.data.message || 'Invalid login attempt');
            }
        } catch (error) {
            setErrorMessage('Login failed. Please check your network and try again.');
        }
    };

    const handleNavigateToSignup = () => {
        navigate('/admin/signup');
    };

    return (
        <div className="admin-login-container">
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit" className="login-btn">Login</button>
                <p className="signup-link" onClick={handleNavigateToSignup}>Don't have an admin account? Sign up</p>
            </form>
        </div>
    );
};

export default AdminLogin;
