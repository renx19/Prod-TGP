import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  MDBInput,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.scss';

const Signup = () => {
  const { isAuthenticated, signup, role } = useAuthStore(); // include role
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, role, navigate]);

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
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred while signing up. Please check your inputs.');
      toast.error('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <MDBContainer
      fluid
      className="d-flex align-items-center justify-content-center py-5"
      style={{
        minHeight: 'calc(100vh - 100px)', // Adjust if your navbar is taller// Push below navbar
        backgroundColor: '#f8f9fa'       // Optional background
      }}
    >

      <MDBRow className="justify-content-center">
        <MDBCol size="12" md="10" lg="8" xl="10">
          <div
            className="mx-auto"
            style={{
              maxWidth: '900px',
              backgroundColor: '#fff',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              minHeight: '500px',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {/* Signup Form Section */}
            <div className="d-flex flex-column justify-content-center p-4" style={{ flex: 1, minHeight: '500px' }}>

              <div className="text-center mb-4">
                <img src="light.jpg" alt="logo" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                <h4 className="mt-1 mb-4">Tau Gamma Phi Tayhi Chapter</h4>
              </div>
              <p className="text-center">Please fill in the details to create your account</p>

              <form className="signup-form" onSubmit={handleSignup}>
                <MDBInput wrapperClass="mb-4 p-1" label="Username" id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <MDBInput wrapperClass="mb-4 p-1" label="Email address" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <MDBInput
                  wrapperClass="mb-4 p-1"
                  label="Password"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  append={
                    <span className="eye-icon" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </span>
                  }
                />
                {error && <p className="text-danger text-center">{error}</p>}

                <div className="row mt-3 gx-3">
                  <div className="col-12 col-md-6">
                    <MDBBtn
                      type="submit"
                      className="w-100 gradient-custom-2"
                      disabled={loading}
                    >
                      {loading ? 'Signing Up...' : 'Sign Up'}
                    </MDBBtn>
                  </div>
                  
                </div>



              </form>
            </div>

            {/* Promo Section */}
            <div className="gradient-custom-2 d-none d-md-flex flex-column justify-content-center text-white p-4" style={{ flex: 1, minHeight: '500px' }}>
              <h4 className="mb-4">We are more than just a fraternity</h4>
                <p className="small mb-0">
                  A bond of brotherhood that goes beyond time — united by values, loyalty, and lifelong friendship. Together we grow, lead, and support one another.
                </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Signup;
