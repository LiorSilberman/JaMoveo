import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';


/**
 * Login is a React component that provides a user interface for logging into the application.
 * It handles user input for username and password, sends these credentials to a backend server,
 * and handles the server's response by either storing user data in localStorage and redirecting
 * to the home page or displaying error messages for authentication issues.
 */
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://192.168.1.102:5000/login', {
                username: username,
                password: password
            });

            if (response.data['message'] === 'login successful') {
                login({ username: response.data.username, instrument: response.data.role });
                navigate('/', { state: { id: username } });
            } else if (response.data === 'incorrect password') {
                setErrorMessage('Incorrect password, please try again.');
            } else if (response.data === 'user not found') {
                setErrorMessage('User not found. Please check your username.');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit" className="submit-btn">Login</button>
            </form>
            <div className="signup-redirect">
                <p>Don't have an account?</p>
                <button onClick={() => navigate('/signup')} className="redirect-btn">Go to Signup</button>
            </div>
        </div>
    );
};

export default Login;