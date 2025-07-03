import { useState } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import SidebarComponent from '../components/Sidebar'; // Import the Sidebar component
import '../styles/navbar.scss';
import Footer from '../components/Footer'

const Layout = ({ children }) => {
  const [toggled, setToggled] = useState(false);

  return (
    <>
      <Navbar onToggleSidebar={() => setToggled(!toggled)} />

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
        }}
      >
        {/* Sidebar */}
        <SidebarComponent
          toggled={toggled}
          onBackdropClick={() => setToggled(false)}
        />

        {/* Backdrop */}
        {toggled && (
          <div
            onClick={() => setToggled(false)}
            style={{
              position: 'fixed',
              top: '55px',
              left: 0,
              width: '100%',
              height: 'calc(100% - 55px)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 4,
            }}
          />
        )}

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            marginTop: '80px',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '100%',
       
           
          }}
        >
          <main>{children}</main>
        </div>

        {/* Footer appears at end of scroll */}
        <Footer />
      </div>
    </>
  );
};

// Prop types for Layout
Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
