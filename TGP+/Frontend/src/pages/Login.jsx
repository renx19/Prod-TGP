import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import useMemberStore from '../store/memberStore';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MDBInput, MDBBtn, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.scss';

const LoginForm = () => {
  const { isAuthenticated, login, user, loading } = useAuthStore(); // Use loading from authStorea
  const { fetchMemberDetails } = useMemberStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);

  // Fetch member details after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMemberDetails(user);
    }
  }, [isAuthenticated, user, fetchMemberDetails]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    try {
      await login(email, password);
      setEmail(''); // Reset email field after login
      setPassword(''); // Reset password field after login
      toast.success('Login successful! Redirecting...'); // Show success toast
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.'); // Set error message
      toast.error('Invalid email or password. Please try again.'); // Show error toast
    }
  };

  return (
    <MDBContainer className="my-5 gradient-form d-flex align-items-center justify-content-center" style={{ height: '100vh',  }}>
      <MDBRow className="justify-content-center">
        <MDBCol col='12' md='10' lg='10'>
          <div className="d-flex flex-row h-100" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', borderRadius: '8px' }}>
            <div className="gradient-custom-2 d-none d-md-flex flex-column justify-content-center text-white p-4" style={{ width: '70%', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
              <h4 className="mb-4">We are more than just a company</h4>
              <p className="small mb-0">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            <div className="d-flex flex-column justify-content-center" style={{ width: '100%', padding: '40px' }}>
              <div className="text-center mb-4">
                <img src="light.jpg" style={{ width: '100px', height: '100px', borderRadius: '50%' }} alt="logo" />
                <h4 className="mt-1 mb-4">Tau Gamma Phi Tayhi Chapter</h4>
              </div>
              <p>Please login to your account</p>

              {error && <p className="text-danger text-center">{error}</p>}

              <form className="login-form" onSubmit={handleLogin}>
                <MDBInput
                  wrapperClass='mb-4'
                  label='Email address'
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <MDBInput
                  wrapperClass='mb-4'
                  label='Password'
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  {loading ? 'Logging in...' : 'Login'}
                </MDBBtn>
              </form>

              <div className="text-center pt-1 mb-4">
                <Link className="" to="/forgot-password">Forgot password?</Link>
              </div>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default LoginForm;
