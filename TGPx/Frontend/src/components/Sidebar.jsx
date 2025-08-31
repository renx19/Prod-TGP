import '../styles/sidebar.scss'; // import SCSS file

import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import PropTypes from 'prop-types';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from '@mui/icons-material/Group';

import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const SidebarComponent = ({ toggled, onBackdropClick }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <Sidebar
      onBackdropClick={onBackdropClick}
      toggled={toggled}
      breakPoint="all"
      className={`sidebar ${!toggled ? 'hidden' : ''}`}
    >
      <Menu iconShape="square" className="menu">
        {isAuthenticated && role === 'admin' && (
          <>
            <MenuItem icon={<EventIcon />} component={<Link to="/event-list" />}>
              Event List
            </MenuItem>
            <MenuItem icon={<AttachMoneyIcon />} component={<Link to="/financial-list" />}>
              Financial List
            </MenuItem>
            <MenuItem icon={<GroupIcon />} component={<Link to="/members" />}>
              Members
            </MenuItem>
            <MenuItem icon={<GroupIcon />} component={<Link to="/signup" />}>
              Create User
            </MenuItem>

          </>
        )}

        {isAuthenticated && role === 'member' && user && (
          <>
            <MenuItem icon={<PersonIcon />} component={<Link to="/member/${user._id" />}>
              My Profile
            </MenuItem>

            <MenuItem icon={<AttachMoneyIcon />} component={<Link to="/financialList" />}>
              Financial List
            </MenuItem>
          </>



        )}
      </Menu>

      {isAuthenticated && (
        <Menu iconShape="square" className="logout-menu">
          <MenuItem icon={<LogoutIcon />} onClick={logout}>
            Logout
          </MenuItem>
        </Menu>
      )}
    </Sidebar>
  );
};

SidebarComponent.propTypes = {
  toggled: PropTypes.bool.isRequired,
  onBackdropClick: PropTypes.func.isRequired,
};

export default SidebarComponent;
