import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';  // Import Socket.IO client

// Connect to the Socket.IO server running at localhost:5000
const socket = io('http://192.168.1.102:5000');

const MainPagePlayer = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [waiting, setWaiting] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')); 
        if (user) {
            setIsLoggedIn(true);
            setUsername(user.username);

            socket.emit("playerJoined", { username: user.username });

            socket.on('songSelected', (song) => {
                setWaiting(false);
                navigate('/live', { state: { song } });
            });
        } else {
            setIsLoggedIn(false);
        }

        return () => {
            socket.off('songSelected');
        };
    }, [navigate]);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div className="main-page-container">
            {isLoggedIn ? (
                <>
                    <h1>Hello {username}, welcome to the player page!</h1>
                    {waiting ? (
                        <h2>Waiting for the next song...</h2>
                    ) : (
                        <h2>Song selected! Redirecting...</h2>
                    )}
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </>
            ) : (
                <>
                    <h1>Welcome to the player page!</h1>
                    <button onClick={() => navigate('/login')} className="login-btn">Login</button>
                    <button onClick={() => navigate('/signup')} className="signup-btn">Signup</button>
                </>
            )}
        </div>
    );
};

export default MainPagePlayer;
