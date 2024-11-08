import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import '../styles/login.scss'; // Import the CSS file

const Unauthorized = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleGoHome = () => {
    navigate('/'); // Navigate to the home page when the button is clicked
  };

  return (
    <div className="unauthorized-container">
      <h1 className="heading">Unauthorized Access</h1>
      <p className="paragraph">You do not have permission to view this page.</p>
      <button className="back-home-button" onClick={handleGoHome}>
        Go Back Home
      </button>
    </div>
  );
};

export default Unauthorized;
