import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import {
  MDBInput,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.scss';

const Signup = () => {
  const { isAuthenticated, signup } = useAuthStore(); // Use the signup function here
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNextEnabled, setIsNextEnabled] = useState(false); // State for Next button
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call the signup function with role if needed
      await signup(username, email, password); // Adjust if role needs to be passed
      toast.success('Account created successfully! Redirecting to member creation...');
      setUsername('');
      setEmail('');
      setPassword('');
      setIsNextEnabled(true); // Enable the Next button after successful signup
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred while signing up. Please check your inputs.');
      toast.error('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    navigate('/member-creation');
  };

  return (
    <MDBContainer className="my-5 d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <MDBRow className="justify-content-center">
        <MDBCol col='12' md='10' lg='8' className="mb-5">
          <div className="d-flex flex-row h-100" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', borderRadius: '8px', flexWrap: 'wrap' }}>
            
            {/* Signup Form Section */}
            <div className="d-flex flex-column justify-content-center" style={{ flex: 1, padding: '40px' }}>
              <div className="text-center mb-4">
                <img
                  src="light.jpg"
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                  alt="logo"
                />
                <h4 className="mt-1 mb-4">Tau Gamma Phi Tayhi Chapter</h4>
              </div>
              <p>Please fill in the details to create your account</p>
    
              <form className="signup-form" onSubmit={handleSignup}>
                <MDBInput
                  wrapperClass='mb-4'
                  label='Username'
                  id='username'
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  invalid={!!error}
                />
                <MDBInput
                  wrapperClass='mb-4'
                  label='Email address'
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  invalid={!!error}
                />
                <MDBInput
                  wrapperClass='mb-4'
                  label='Password'
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  append={<span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </span>}
                  invalid={!!error}
                />
                {error && <p className="text-danger">{error}</p>}
                
                {/* Centered Button Container */}
                <div className="d-flex flex-column align-items-center" style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '400px' }}>
                    <MDBBtn
                      type="submit"
                      className="mb-4 gradient-custom-2"
                      style={{
                        height: '50px',
                        width: '48%',
                        lineHeight: '40px',
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Signing Up...' : 'Sign Up'}
                    </MDBBtn>
                    <MDBBtn
                      type="button"
                      className="mb-4 gradient-custom-2"
                      style={{
                        height: '50px',
                        width: '48%',
                        lineHeight: '40px',
                      }}
                      onClick={handleNext}
                      disabled={!isNextEnabled} // Disable Next button if not enabled
                    >
                      Next
                    </MDBBtn>
                  </div>
                </div>
              </form>
            </div>

            {/* Promotional Section */}
            <div className="gradient-custom-2 d-none d-md-flex flex-column justify-content-center text-white p-4" style={{ flex: 1, borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
              <h4 className="mb-4">We are more than just a company</h4>
              <p className="small mb-0">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Signup;
