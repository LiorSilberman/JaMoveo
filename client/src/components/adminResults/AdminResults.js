import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './AdminResults.css';
import axios from 'axios';

const socket = io('http://192.168.1.102:5000');


/**
 * AdminResults is a React component that displays a list of song search results.
 * It retrieves the list of songs from the navigation state, provided by the adminPage.
 * Each song can be clicked to initiate a scraping request to the backend for additional song data,
 * and once the data is fetched, it emits a socket event with the complete song data and navigates to a live song display page.
 */
const AdminResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { songs } = location.state || { songs: [] };

    const handleSongClick = async (song) => {
        try {
            const response = await axios.post('http://192.168.1.102:5000/api/scrape', { songUrl: song.url });
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
