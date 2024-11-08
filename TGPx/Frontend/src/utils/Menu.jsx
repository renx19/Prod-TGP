import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import '../styles/navbar.scss';

const BasicMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="centered-menu-container">
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                className="centered-menu-button"
            >
                Menu
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                
                }}
            >
                <MenuItem onClick={handleClose} className="menu-item">
                    <Link to="/home">Home</Link>
                </MenuItem>
                <MenuItem onClick={handleClose} className="menu-item">
                    <Link to="/about">About</Link>
                </MenuItem>
                <MenuItem onClick={handleClose} className="menu-item">
                    <Link to="/contact">Contact</Link>
                </MenuItem>
                <MenuItem onClick={handleClose} className="menu-item">
                    <Link to="/events">Events</Link>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default BasicMenu;
