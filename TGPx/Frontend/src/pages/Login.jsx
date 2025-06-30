import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import useMemberStore from '../store/memberStore';
import { useNavigate, useLocation, } from 'react-router-dom';
import { MDBInput, MDBBtn, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
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
    <MDBContainer fluid className="py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <MDBRow className="w-100 justify-content-center">
        <MDBCol xs="12" md="10" lg="8" xl="6">
          <div className="rounded-3 shadow d-flex flex-column flex-md-row overflow-hidden bg-white">

            {/* Left - Promo Section */}
            <div className="gradient-custom-2 d-none d-md-flex flex-column justify-content-center text-white p-4" style={{ flex: 1 }}>
              <h4 className="mb-4">We are more than just a company</h4>
              <p className="small mb-0">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            {/* Right - Login Form */}
            <div className="p-4 d-flex flex-column align-items-center justify-content-center w-100" style={{ flex: 1 }}>
              <div className="text-center mb-4">
                <img
                  src="light.jpg"
                  alt="logo"
                  className="rounded-circle"
                  style={{ width: '100px', height: '100px' }}
                />
                <h4 className="mt-3 mb-2">Tau Gamma Phi Tayhi Chapter</h4>
                <p className="mb-0">Please login to your account</p>
              </div>

              {error && <p className="text-danger">{error}</p>}

              <form className="w-100" style={{ maxWidth: '400px' }} onSubmit={handleLogin}>
                <MDBInput
                  wrapperClass="mb-4"
                  label="Email address"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Password"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <MDBBtn
                  type="submit"
                  className="w-100 gradient-custom-2 mb-3 d-flex align-items-center justify-content-center"
                  disabled={loading}
                  style={{ height: '50px' }}
                >
                  <div style={{ width: '110px', textAlign: 'center' }}>
                    {loading ? 'Logging in...' : 'Login'}
                  </div>
                </MDBBtn>




              </form>

              <div>
                <a href="/forgot-password">Forgot password?</a>
              </div>
            </div>

          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>


  );
};

export default LoginForm;
