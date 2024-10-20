import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';

// const socket = io('http://192.168.1.102:5000');


/**
 * MainPagePlayer is a React component for the main player interface of the music app.
 * It handles user authentication state, displays different views based on whether the user
 * is logged in, and manages real-time interactions with the server using Socket.IO.
 */
const MainPagePlayer = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Establish socket connection when the component mounts
        const newSocket = io('http://192.168.1.102:5000');
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
            return;
        }

        if (user?.role !== 'admin') {
            setUsername(user.username);

            socket?.emit("playerJoined", { username: user.username });
            
        } else {
            navigate('/admin');
        }
    }, [socket, navigate, isLoggedIn, user]);

    useEffect(() => {
        if (socket) {
            const handleSongSelected = (song) => {
                navigate('/live', { state: { song } });
            };
            
            socket.on('songSelected', handleSongSelected);
            return () => {
                socket.off('songSelected', handleSongSelected);
            };
        }
    }, [socket, navigate]);


    return (
        <div className="main-page-container">
            {isLoggedIn && user?.role !== 'admin' ? (
                <>
                    <h1>Welcome to JaMoveo, {username}!</h1>
                    <h2>Waiting for the next song...</h2>
                </>
            ) : (
                <>
                    <h1>Welcome to the Jam Session Hub!</h1>
                    <h2>Please log in to join the music experience.</h2>
                </>
            )}
        </div>
    );
};

export default MainPagePlayer;