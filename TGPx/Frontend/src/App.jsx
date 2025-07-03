// src/App.js
import { useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from './store/authStore';
import routes from './RouteConfig'; // Adjust the import path
import Loading from './utils/loading';
import ProtectedLayout from './auth/protectedLayout';
import './App.css'


function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
 <ToastContainer position="top-right" autoClose={5000} hideProgressBar style={{ zIndex: 9999 }} />
      <Routes>
        {routes.map(({ path, element, isProtected }) => (
          <Route
            key={path}
            path={path}
            element={
              isProtected ? (
                <ProtectedLayout>
                  {element}
                </ProtectedLayout>
              ) : (
                element // Just render the element for unprotected routes
              )
            }
          />
        ))}
      </Routes>
  
    </Router>
  );
}

export default App;
