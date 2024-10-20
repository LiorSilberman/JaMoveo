import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false); 
  }

  const handleToggle = () => setIsOpen(!isOpen);
  
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          JaMoveo
        </Link>
        <div className="menu-icon" onClick={handleToggle}>
          <FontAwesomeIcon icon={faBars} />
        </div>

        <div className={isOpen ? "navbar-links active" : "navbar-links"}>
          {!isLoggedIn ? (
            <>
               <Link to="/login" className="nav-link" onClick={handleLinkClick}>Login</Link>
               <Link to="/signup" className="nav-link" onClick={handleLinkClick}>Signup</Link>
               <Link to="/admin/login" className="nav-link" onClick={handleLinkClick}>Admin</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="logout-btn">
              <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;