import React from 'react';
import { PacmanLoader } from 'react-spinners';
import '../styles/success.scss'

const Loading = () => {
  return (
    <div className="loading-container">
      <PacmanLoader color="#36d7b7" size="150"/>
    </div>
  );
};

export default Loading;
