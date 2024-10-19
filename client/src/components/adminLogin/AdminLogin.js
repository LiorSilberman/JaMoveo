import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        const adminCredentials = {
            username: 'admin',
            password: 'admin123',
            role: 'admin'
        };

        if (username === adminCredentials.username && password === adminCredentials.password) {
            // Successful login, store admin login state in localStorage
            localStorage.setItem('isAdminLoggedIn', true);
            localStorage.setItem('user', JSON.stringify({ username: adminCredentials.username, role: adminCredentials.role }));

            // Redirect to the admin dashboard
            navigate('/admin');
        } else {
            setErrorMessage('Invalid username or password');
        }
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
            </form>
        </div>
    );
};

export default AdminLogin;
