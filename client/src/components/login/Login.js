import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // Import the CSS file for styling

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://192.168.1.102:5000/login', {
                username: username,
                password: password
            });
            console.log(response.data);
            if (response.data['message'] === 'login successful') {
                localStorage.setItem('user', JSON.stringify({
                    username: response.data.username,
                    role: response.data.role
                }));
                navigate('/', { state: { id: username } });
            } else if (response.data['message'] === 'incorrect password') {
                setErrorMessage('Incorrect password, please try again.');
            } else if (response.data['message'] === 'user not found') {
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
