import { useNavigate } from 'react-router-dom';
import '../styles/login.scss'; // reuse the same styles

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // go back to home
  };

  return (
    <div className="unauthorized-container"> {/* reuse the same container class */}
      <h1 className="heading">404</h1>
      <p className="paragraph">Oops! The page you are looking for does not exist.</p>
      <button className="back-home-button" onClick={handleGoHome}>
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
