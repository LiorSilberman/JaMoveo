import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AdminLogin is a React component for rendering an admin login form.
 * This component handles the authentication of an admin user based on hardcoded credentials.
 * Upon successful authentication, it stores the admin status in localStorage and navigates to the admin dashboard.
 * If the authentication fails, it displays an error message.
 */
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
            localStorage.setItem('isAdminLoggedIn', true);
            localStorage.setItem('user', JSON.stringify({ username: adminCredentials.username, role: adminCredentials.role }));

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
