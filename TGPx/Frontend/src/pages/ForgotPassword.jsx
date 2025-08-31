import { useState } from 'react';
import axios from 'axios';
import { MDBInput, MDBBtn, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // ✅ new state

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      toast.success(response.data.message || 'Password reset link sent!');
      setSuccess(true); // ✅ mark as success
    } catch (err) {
      const msg = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="gradient-form d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <MDBRow className="justify-content-center">
        <MDBCol col='16' md='12' lg='10'>
          <div className="d-flex flex-row h-100" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', borderRadius: '8px' }}>
            
            {/* Left Info Panel */}
            <div className="gradient-custom-2 d-none d-md-flex flex-column justify-content-center text-white p-4" style={{ width: '70%', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
              <h4 className="mb-4">We are here to help!</h4>
              <p className="small mb-0">
                Enter your email address below to receive a password reset link.
              </p>
            </div>

            {/* Form Section */}
            <div className="d-flex flex-column justify-content-center" style={{ width: '100%', padding: '40px' }}>
              <div className="text-center mb-4">
                <img src="light.jpg" style={{ width: '100px', height: '100px', borderRadius: '50%' }} alt="logo" />
                <h4 className="mt-1 mb-4">Tau Gamma Phi Tayhi Chapter</h4>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p className=" text-center">Please ensure your email is registered with us.</p>
              </div>

              {error && <p className="text-danger text-center">{error}</p>}
              {success && <p className="text-success text-center">✅ We sent a reset link to your email.</p>} {/* ✅ success message */}

              <form className="login-form" onSubmit={handleSubmit}>
                <MDBInput
                  wrapperClass='mb-4'
                  label='Email address'
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={success} // ✅ disable input if successful
                />
                <MDBBtn
                  type="submit"
                  className="mb-4 gradient-custom-2"
                  style={{
                    width: '300px',
                    height: '50px',
                    margin: '0 auto',
                    display: 'block',
                    lineHeight: '50px',
                    padding: '0'
                  }}
                  disabled={loading || success} // ✅ disable button only on success
                >
                  {loading 
                    ? 'Sending...' 
                    : success 
                      ? 'Reset Link Sent' 
                      : 'Send Reset Link'}
                </MDBBtn>
              </form>

              <div style={{ marginTop: '20px' }}>
                <p className="small text-center">We will send you an email with instructions to reset your password.</p>
              </div>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ForgotPassword;
