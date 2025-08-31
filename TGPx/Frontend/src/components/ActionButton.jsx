import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import '../styles/custom-mui.scss'; // import your SCSS file

const ActionButton = ({ label, color, icon, to, onClick }) => {
  const buttonContent = (
    <Button
      variant="contained"
      color={color}
      startIcon={icon}
      onClick={!to ? onClick : undefined} // only attach click if not a link
      className="mui-action-button"
    >
      {label}
    </Button>
  );

  // Wrap in Link for navigation
  return to ? (
    <Link to={to} className="mui-action-link">
      {buttonContent}
    </Link>
  ) : (
    buttonContent
  );
};

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'error',
    'warning',
    'info',
  ]).isRequired,
  icon: PropTypes.node,
  to: PropTypes.string,
  onClick: PropTypes.func,
};

export default ActionButton;
