import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import './Live.css'; 

// Connect to the Socket.IO server
const socket = io('http://192.168.1.102:5000');


/**
 * Live is a React component that displays the currently selected song for live performance or viewing.
 * It integrates with a Socket.IO server to receive commands and sends user role-based navigation commands.
 * The component adjusts the display based on the user's role ('admin'/player or 'singer') and provides functionality 
 * for scrolling lyrics, handling song exit, and adapting text direction based on content language (e.g., RTL for Hebrew).
 */
const Live = () => {
    const [song, setSong] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSingingMode, setIsSingingMode] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [scrolling, setScrolling] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
        } else {
            if (user.role === 'admin') {
                setIsAdmin(true);
            }

            if (user.role?.toLowerCase() === 'singer') {
                setIsSingingMode(true);
            }
        }

        const passedSong = location.state?.song;
        if (passedSong) {
            setSong(passedSong);
        }

    }, [navigate, location.state?.song]);


    useEffect(() => {
        socket.on('quitSong', ({ role }) => {
            console.log('Received quit event, redirecting to main page', role);
            if (role !== 'admin') {
                navigate('/');
            } else {
                navigate('/admin'); 
            }
        });

        return () => {
            socket.off('quitSong');
        };
    }, [navigate]);

    useEffect(() => {
        let scrollInterval;
        if (scrolling) {
            scrollInterval = setInterval(() => {
                window.scrollBy(0, 1);
            }, 50);
        }
        return () => {
            if (scrollInterval) clearInterval(scrollInterval);
        };
    }, [scrolling]);

    const toggleScrolling = () => {
        setScrolling(!scrolling);
    };

    const handleQuit = () => {
        const user = JSON.parse(localStorage.getItem('user'));

        socket.emit('quitSong', user.role);
        if (user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    const isHebrew = (text) => /[\u0590-\u05FF]/.test(text);
    const isSongHebrew = song && song.song && song.song.some(lineGroup =>
        lineGroup.some(line => isHebrew(line.lyrics))
    );

    return (
        <div className={`live-page-container ${isSongHebrew ? 'rtl' : ''}`}>
            <h1>Live Song Page</h1>
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
                <button
                    className="scroll-toggle"
                    onClick={toggleScrolling}
                    aria-label={scrolling ? 'Pause Scrolling' : 'Start Scrolling'}
                >
                    <FontAwesomeIcon icon={scrolling ? faPause : faPlay} />
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