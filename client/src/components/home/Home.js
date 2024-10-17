import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Check if the user is logged in (for example, check for a token in local storage)
        const user = JSON.parse(localStorage.getItem('user')); 
        if (user) {
            setIsLoggedIn(true);
            setUsername(user.username);
        }
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('user'); // Remove user data/token from local storage
        setIsLoggedIn(false);
        navigate('/login'); // Redirect to login page after logging out
    };

    return (
        <div className='homepage'>
            {
                isLoggedIn ? (
                    <>
                        <h1>Hello {username}, welcome to the homepage!</h1>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <h1>Welcome to the homepage!</h1>
                        <button onClick={() => navigate('/login')}>Login</button>
                        <button onClick={() => navigate('/signup')}>Signup</button>
                    </>
                )
            }
        </div>
    );
};

export default Home;
