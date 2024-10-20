import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AdminPage.css';

/**
 * AdminPage is a React component that serves as the administrative interface for song searches.
 * It checks if an admin is logged in on component mount and redirects to the admin login page if not.
 * This component provides an input field for searching songs, initiating an
 * API call to fetch results which are then passed via navigation state to the results page.
 */
const AdminPage = () => {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!isLoggedIn || user?.role !== 'admin') {
            navigate('/admin/login');
        }
    }, [isLoggedIn, user, navigate]);

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`https://jamoveo-production-ddb9.up.railway.app/search-songs?query=${searchQuery}`);
            
            if (response.data.message === "No songs found") {
                setErrorMessage('No results found for your query.');
            }else{
                navigate('/results', { state: { songs: response.data } });
            }
                
        } catch (error) {
            console.error('Error fetching search results:', error);
            navigate('/results', { state: { songs: [] } });
        }
    };

    return (
        <div className="admin-page-container">
            <h1>Search any song...</h1>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter lyrics or chords..."
                    className="search-input"
                    required
                />
                <button type="submit" className="search-btn">Search</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default AdminPage;
