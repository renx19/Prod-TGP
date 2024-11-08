import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MDBInput,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.scss'; // Ensure you have your styles imported

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
};

const getPasswordStrength = (password) => {
  if (password.length < 8) return 'Too short';
  if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) {
    return 'Strong';
  }
  return 'Weak';
};

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // State for error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Validate passwords
    if (!validatePassword(newPassword)) {
      toast.error('Password must be at least 8 characters long and include upper case, lower case, numbers, and special characters.');
      setLoading(false); // Stop loading
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      setLoading(false); // Stop loading
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4000/reset-password/${token}`, { newPassword });
      toast.success(response.data.message);
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after a brief pause
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <MDBContainer className=" gradient-form d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <MDBRow className="justify-content-center">
        <MDBCol col='12' md='12' lg='12'> {/* Adjusted column sizes for better responsiveness */}
          <div className="d-flex flex-row h-100" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', borderRadius: '8px' }}>
            
            {/* Left Side Promotional Section */}
            <div className="gradient-custom-2 d-none d-md-flex flex-column justify-content-center text-white p-4" style={{ width: '50%', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
              <p>A strong password is key to keeping your account secure!</p>
              <p>Please create a new password that you’ll remember!</p>
            </div>

            {/* Right Side Input Section */}
            <div className="d-flex flex-column justify-content-center" style={{ width: '100%', padding: '40px' }}> {/* Set width to 100% for mobile view */}
              <div className="text-center mb-4">
                <img src="light.jpg" style={{ width: '100px', height: '100px', borderRadius: '50%' }} alt="logo" />
                <h4 className="mt-1 mb-4">Tau Gamma Phi Tayhi Chapter</h4>
                <h2 className="mb-4">Reset Your Password</h2>
              </div>

              {error && <p className="text-danger text-center">{error}</p>}

              <form onSubmit={handleSubmit}>
                <MDBInput
                  wrapperClass='mb-4'
                  label='New Password'
                  id='newPassword'
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p>Password Strength: {getPasswordStrength(newPassword)}</p>
                <MDBInput
                  wrapperClass='mb-4'
                  label='Confirm Password'
                  id='confirmPassword'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <MDBBtn 
                  type="submit" 
                  className="mb-4 gradient-custom-2" 
                  style={{ 
                    width: '300px', 
                    height: '50px', 
                    margin: '0 auto', 
                    display: 'block', 
                    lineHeight: '50px', // Align text vertically
                    padding: '0' // Remove default padding to ensure lineHeight works
                  }} 
                  disabled={loading} // Disable button when loading
                >
                   {loading ? 'Updating...' : 'Reset Password'}
                </MDBBtn>
              </form>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ResetPassword;
