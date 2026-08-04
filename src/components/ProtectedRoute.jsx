import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Only allow admin@smartfootball.com to access admin pages
  if (user.email !== 'admin@smartfootball.com') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}