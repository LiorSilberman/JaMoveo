import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


/**
 * AdminPage is a React component that serves as the administrative interface for song searches.
 * It checks if an admin is logged in on component mount and redirects to the admin login page if not.
 * This component provides an input field for searching songs, initiating an
 * API call to fetch results which are then passed via navigation state to the results page.
 */
const AdminPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
        if (!isAdminLoggedIn) {
            navigate('/admin-login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/admin-login'); 
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`http://192.168.1.102:5000/search-songs?query=${searchQuery}`);
            
            if (response.data) {
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
            {/* Logout Button */}
            <button onClick={handleLogout} className="logout-btn">Logout</button>

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
        </div>
    );
};

export default AdminPage;
