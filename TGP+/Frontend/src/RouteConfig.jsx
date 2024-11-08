// src/routes.js
import SignupForm from './pages/SignUp';
import LoginForm from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';
import Home from './pages/Home';
import About from './pages/About';

import Members from './pages/Admin/MemberManagement'; // General members list for admin
import MemberForm from './pages/Admin/MemberForm'
import MemberDetail from './pages/MemberDetail'
import EventDetails from './pages/EventDetails'
import Events from './pages/Events'
import EventFinancialList from './pages/Admin/EvenFinancialList'
import FinancialEventDetailsPage from './pages/Admin/EventFInancialDetails'
// import MemberDetails from './scenes/membersDetails'; // Individual member details


import { ProtectedRoute } from './auth/protectedroutes'; // Adjust import as necessary
import Contact from './pages/Contact';
import EventList from './pages/Admin/EventList';





export const routes = [

  { path: '/login', element: <LoginForm />, isProtected: false },
  { path: '/', element: <Home />, isProtected: true },
  { path: '/home', element: <Home />, isProtected: true },
  { path: '/about', element: <About />, isProtected: true },
  { path: '/contact', element: <Contact />, isProtected: true },
  { path: '/forgot-password', element: <ForgotPassword />, isProtected: false },
  { path: '/reset-password/:token', element: <ResetPassword />, isProtected: false },
  { path: '/events',   element: <Events />, isProtected: true },
  { path: '/events/:id', element: <EventDetails />, isProtected: true },  // No protection
  

  {
    path: '/event-list',
    element: <ProtectedRoute element={<EventList />} requiredRole={[ 'admin']} />,
    isProtected: true
  },
  {
    path: '/financial-list',
    element: <ProtectedRoute element={<EventFinancialList />} requiredRole={[ 'admin']} />,
    isProtected: true
  },
  {
    path: '/event/:eventId',
    element: <ProtectedRoute element={<FinancialEventDetailsPage />} requiredRole={[ 'admin']} />,
    isProtected: true
  },

  {
    path: '/signup',
    element: <ProtectedRoute element={<SignupForm />} requiredRole={[ 'admin']} />,
    isProtected: true
  },

  {
    path: '/members',
    element: <ProtectedRoute element={<Members />} requiredRole={['admin']} />,
    isProtected: true,
  },
  {
    path: '/member/:id',
    element: <ProtectedRoute element={<MemberDetail />} requiredRole={['member', 'admin']} />,
    isProtected: true,
  },
  {
    path: '/member-creation',
    element: <ProtectedRoute element={<MemberForm />} requiredRole={['admin']} />,
    isProtected: true,
  },
  { path: '/unauthorized', element: <Unauthorized />, isProtected: false },
];

export default routes;
