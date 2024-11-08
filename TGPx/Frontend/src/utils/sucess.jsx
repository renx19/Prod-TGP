import React from 'react';

const SuccessMessage = ({ onDashboard, onCreateAnother }) => {
  return (
    <div className="success-message">
      <h2>Member Created Successfully!</h2>
      <p>Thank you for signing up. You can now manage your members.</p>
      <button onClick={onDashboard}>Go to Dashboard</button>
      <button onClick={onCreateAnother}>Create Another Member</button>
    </div>
  );
};

export default SuccessMessage;
