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

import FinancialList from './pages/FinancialList'
import FinancialListDetail from './pages/FinancialListDetail';
import { ProtectedRoute } from './auth/protectedroutes'; // Adjust import as necessary
import Contact from './pages/Contact';
import EventList from './pages/Admin/EventList';
import Developer from './components/FooterUl/Developer'
import Privacy from './components/FooterUl/Privacy'
import FAQ from './components/FooterUl/FAQ'

import TERMS from './components/FooterUl/Terms'


export const routes = [


  { path: '/login', element: <LoginForm />, isProtected: false },
  { path: '/', element: <Home />, isProtected: true },
  { path: '/home', element: <Home />, isProtected: true },
  { path: '/about', element: <About />, isProtected: true },
  { path: '/contact', element: <Contact />, isProtected: true },
  { path: '/forgot-password', element: <ForgotPassword />, isProtected: false },
  { path: '/reset-password/:token', element: <ResetPassword />, isProtected: false },
  { path: '/events', element: <Events />, isProtected: true },
  { path: '/events/:id', element: <EventDetails />, isProtected: true },  // No protection
  { path: '/footer/privacy', element: <Privacy />, isProtected: true },
  { path: '/footer/faq', element: <FAQ />, isProtected: true },
  { path: '/footer/terms', element: <TERMS />, isProtected: true },
  { path: '/developer', element: <Developer />, isProtected: true },
  {
    path: '/event-list',
    element: <ProtectedRoute element={<EventList />} requiredRole={['admin']} />,
    isProtected: true
  },
  {
    path: '/financial-list',
    element: <ProtectedRoute element={<EventFinancialList />} requiredRole={['admin']} />,
    isProtected: true
  },
  {
    path: '/signup',
    element: <ProtectedRoute element={<SignupForm />} requiredRole={['admin']} />,
    isProtected: true
  },

  {
    path: '/members',
    element: <ProtectedRoute element={<Members />} requiredRole={['admin']} />,
    isProtected: true,
  },
  {
    path: '/financial/:financialId',
    element: <ProtectedRoute element={<FinancialEventDetailsPage />} requiredRole={['admin', ]} />,
    isProtected: true
  },
  {
    path: '/member/:id',
    element: <ProtectedRoute element={<MemberDetail />} requiredRole={['member', 'admin']} />,
    isProtected: true,
  },
    {
    path: '/financialList',
    element: <ProtectedRoute element={<FinancialList />} requiredRole={['member', 'admin']} />,
    isProtected: true,
  },
  {
    path: '/financial-List-Details/:financialId',
    element: <ProtectedRoute element={<FinancialListDetail />} requiredRole={['member', 'admin']} />,
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
