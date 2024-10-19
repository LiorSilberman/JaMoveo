import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './AdminResults.css';
import axios from 'axios';

const socket = io('http://localhost:5000');

const AdminResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { songs } = location.state || { songs: [] };

    const handleSongClick = async (song) => {
        try {
            // Send the request to the correct backend URL with the song URL
            const response = await axios.post('http://localhost:5000/api/scrape', { songUrl: song.url });
            const songData = response.data;

            const fullSongData = {
                title: song.title,
                artist: song.artist,
                song: songData
            };

            socket.emit('adminSongSelected', fullSongData); 
            navigate('/live', { state: { song: fullSongData } });
            
        } catch (error) {
            console.error('Error scraping song:', error);
        }
    };

    return (
        <div className="results-page-container">
            <h1>Search Results</h1>
            {songs.length > 0 ? (
                <ul>
                    {songs.map((song, index) => (
                        <li key={index} onClick={() => handleSongClick(song)}>
                            <img src={song.image} alt={song.title} style={{ width: '100px' }} />
                            <div>
                                <h3>{song.title}</h3>
                                <p>{song.artist}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found for your query.</p>
            )}
        </div>
    );
};

export default AdminResults;
