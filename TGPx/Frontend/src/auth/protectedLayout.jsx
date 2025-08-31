import { useState } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import SidebarComponent from '../components/Sidebar';
import Footer from '../components/Footer';

import '../styles/sidebar.scss'; // Import the new SCSS

const Layout = ({ children }) => {
  const [toggled, setToggled] = useState(false);

  return (
    <>
      <Navbar onToggleSidebar={() => setToggled(!toggled)} />

      <div className="layout-container">
        <SidebarComponent
          toggled={toggled}
          onBackdropClick={() => setToggled(false)}
        />

        {toggled && (
          <div
            className="layout-backdrop"
            onClick={() => setToggled(false)}
          />
        )}

        <div className="layout-main">
          <main>{children}</main>
        </div>

        <Footer />
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
