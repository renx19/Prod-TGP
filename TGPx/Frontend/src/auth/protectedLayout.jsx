import { useState } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import SidebarComponent from '../components/Sidebar'; // Import the Sidebar component
import '../styles/navbar.scss';

const Layout = ({ children }) => {
  const [toggled, setToggled] = useState(false);

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden', position: 'relative', backgroundColor: '#fff' }}>
      {/* Full-width Navbar */}
      <Navbar onToggleSidebar={() => setToggled(!toggled)} />

      {/* Sidebar as an overlay */}
      <SidebarComponent 
        toggled={toggled} 
        onBackdropClick={() => setToggled(false)} 
      />

      {/* Backdrop for overlay effect */}
      {toggled && (
        <div
          onClick={() => setToggled(false)}
          style={{
            position: 'fixed',
            top: '55px',
            left: 0,
            width: '100%',
            height: 'calc(100% - 55px)',
            backgroundColor: 'transparent', // Semi-transparent black
            zIndex: 4, // Below sidebar but above main content
          }}
        />
      )}

      {/* Main content area */}
      <div style={{
        flex: 1,
        marginTop: '120px', // Ensures space for the Navbar height
        marginLeft: 'auto', // Center the content
        marginRight: 'auto', // Center the content
        overflowY: 'auto', // Allow vertical scrolling
        maxHeight: 'calc(100vh - 55px)', // Ensure main content does not exceed viewport height
      }}>
        <main>{children}</main>
      </div>
    </div>
  );
};

// Prop types for Layout
Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
