import PropTypes from 'prop-types';

import { NavLink, } from 'react-router-dom';
// import { MenuOpen, Login } from '@mui/icons-material';
import { MenuOpen,  } from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import { useMediaQuery } from '@mui/material';
import BasicMenu from '../utils/Menu';
import '../styles/navbar.scss';

const Navbar = ({ onToggleSidebar }) => {
  const isMobile = useMediaQuery('(max-width: 820px)');

  // Get the authentication state and role from the store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  // Optionally, define which roles are allowed to see the sidebar button
  const isSidebarVisible = isAuthenticated && (role === 'admin' || role === 'member');

  return (
    <nav className="navbar-container">
      {/* Sidebar Toggle Icon */}
      {isSidebarVisible && (
        <div className="sidebar-toggle-icon" onClick={onToggleSidebar}>
          <MenuOpen />
        </div>
      )}


      {/* Navigation Links (Mobile: BasicMenu, Desktop: Regular Links) */}
      {isMobile ? (
        <BasicMenu />
      ) : (
        <div className="nav-links">
          <NavLink to="/home" className="nav-link">Home</NavLink>
          <NavLink to="/about" className="nav-link">About</NavLink>
          <NavLink to="/contact" className="nav-link">Contact</NavLink>
          <NavLink to="/events" className="nav-link">Events</NavLink>
        </div>
      )}

      {/* Floating Login Button wrapped with NavLink */}
      {/* <NavLink to="/login" className="login-icon">
        <Login />
      </NavLink> */}


    </nav>
  );
};

Navbar.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
};

export default Navbar;
