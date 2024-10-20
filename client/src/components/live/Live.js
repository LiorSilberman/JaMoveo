import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import './Live.css'; 
import { useAuth } from '../../context/AuthContext'; // Import the authentication context



/**
 * Live is a React component that displays the currently selected song for live performance or viewing.
 * It integrates with a Socket.IO server to receive commands and sends user role-based navigation commands.
 * The component adjusts the display based on the user's role ('admin'/player or 'singer') and provides functionality 
 * for scrolling lyrics, handling song exit, and adapting text direction based on content language (e.g., RTL for Hebrew).
 */
const Live = () => {
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, user } = useAuth();
    const [isSingingMode, setIsSingingMode] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(50); 
    const song = location.state?.song;


    useEffect(() => {
        const newSocket = io('https://jamoveo-production-ddb9.up.railway.app');
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

        if (user && user.role === 'admin'){
            setIsAdmin(true);
        }

        if (user && user.instrument?.toLowerCase() === 'singer') {
            setIsSingingMode(true);
        }
    }, [isLoggedIn, user, navigate]);


    useEffect(() => {
        if (!socket) return;
        const handleQuitSong = ({ role }) => {
            if (role !== 'admin') {
                navigate('/');
            } else {
                navigate('/admin'); 
            }
        };
    
        socket.on('quitSong', handleQuitSong);
    
        return () => {
            socket.off('quitSong', handleQuitSong);
        };
    }, [navigate, socket]);

    useEffect(() => {
        let scrollInterval;
        if (scrolling) {
            scrollInterval = setInterval(() => {
                window.scrollBy(0, 1);
            }, scrollSpeed);
        }
        return () => {
            if (scrollInterval) clearInterval(scrollInterval);
        };
    }, [scrolling, scrollSpeed]);

    const adjustScrollSpeed = (increment) => {
        setScrollSpeed(prevSpeed => Math.max(10, prevSpeed + increment));
    };

    const toggleScrolling = () => {
        setScrolling(!scrolling);
    };

    const handleQuit = () => {
        if (user) {
            socket.emit('quitSong', user.role);

            // Redirect based on user role
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    };

    const isHebrew = (text) => /[\u0590-\u05FF]/.test(text);
    const isSongHebrew = song && song.song && song.song.some(lineGroup =>
        lineGroup.some(line => isHebrew(line.lyrics))
    );

    return (
        <div className={`live-page-container ${isSongHebrew ? 'rtl' : ''}`}>
            <h1>On Air: Streaming Live Beats and Tunes</h1>
            {song ? (
                <div className="song-container">
                    <div className="song-title-artist">
                        <h2>{song.title}</h2>
                        <span className="song-artist">{song.artist}</span>
                    </div>

                    {song.song ? (
                        song.song.map((lineGroup, index) => (
                            <div key={index} className="song-line-group">
                                {lineGroup.map((line, subIndex) => (
                                    <div key={subIndex} className="song-line">
                                        {!isSingingMode && (
                                            <pre className="song-chords">{line.chords}</pre>
                                        )}
                                        <pre className="song-lyrics">{line.lyrics}</pre>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <h2>No song data available</h2>
                    )}
                </div>
            ) : (
                <h2>Waiting for a song to be selected...</h2>
            )}

            <div className="floating-button-container">
                <button className="scroll-toggle" onClick={toggleScrolling}>
                    <FontAwesomeIcon icon={scrolling ? faPause : faPlay} />
                </button>

                {/* Scroll speed adjustment buttons with icons */}
                <button className="scroll-speed-btn" onClick={() => adjustScrollSpeed(10)}>
                    <FontAwesomeIcon icon={faMinus} />
                </button>
                <button className="scroll-speed-btn" onClick={() => adjustScrollSpeed(-10)}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>

                {isAdmin && (
                    <button className="quit-btn" onClick={handleQuit}>
                        Quit
                    </button>
                )}
            </div>
        </div>
    );
};

export default Live;
