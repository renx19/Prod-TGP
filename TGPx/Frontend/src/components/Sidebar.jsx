import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import PropTypes from 'prop-types';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const SidebarComponent = ({ toggled, onBackdropClick }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);

  return (
    <Sidebar
      onBackdropClick={onBackdropClick}
      toggled={toggled}
      breakPoint="always"
      style={{
        position: 'fixed',
        top: '75px',
        left: toggled ? '0' : '-250px',
        width: '250px',
        height: 'calc(100% - 65px)',
        transition: 'left 0.3s ease',
        backgroundColor: '#242424',
        borderRight: '1px solid #242424',
        zIndex: 5,
      }}
    >
      <Menu iconShape="square" style={{ color: '#fff' }}>
        {isAuthenticated && role === 'admin' && (
          <>
            <MenuItem icon={<EventIcon />} style={{ color: '#cfd7e6' }}>
              <Link to="/event-list" style={{ textDecoration: 'none', color: 'inherit' }}>
                Event List
              </Link>
            </MenuItem>
            <MenuItem icon={<AttachMoneyIcon />} style={{ color: '#cfd7e6' }}>
              <Link to="/financial-list" style={{ textDecoration: 'none', color: 'inherit' }}>
                Financial List
              </Link>
            </MenuItem>
            <MenuItem icon={<GroupIcon />} style={{ color: '#cfd7e6' }}>
              <Link to="/members" style={{ textDecoration: 'none', color: 'inherit' }}>
                Members
              </Link>
            </MenuItem>
            <MenuItem icon={<PersonAddIcon />} style={{ color: '#cfd7e6' }}>
              <Link to="/member-creation" style={{ textDecoration: 'none', color: 'inherit' }}>
                Member Creation
              </Link>
            </MenuItem>
          </>
        )}

        {isAuthenticated && role === 'member' && (
          <MenuItem icon={<PersonIcon />} style={{ color: '#cfd7e6' }}>
            <Link to="/member/:id" style={{ textDecoration: 'none', color: 'inherit' }}>
              My Profile
            </Link>
          </MenuItem>
        )}

      </Menu>

      {isAuthenticated && (
        <Menu iconShape="square" style={{ position: 'absolute', bottom: '20px', width: '100%' }}>
          <MenuItem 
            icon={<LogoutIcon />} 
            style={{ color: '#cfd7e6' }}
            onClick={logout}
          >
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
