import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../services/api';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const [state, setState] = useState({ checking: Boolean(token), allowed: false });

  useEffect(() => {
    if (!token) return;
    let active = true;
    api.get('/me').then(({ data }) => {
      if (!active) return;
      localStorage.setItem('user', JSON.stringify(data));
      setState({ checking: false, allowed: Boolean(data.is_admin) });
    }).catch(() => {
      if (active) setState({ checking: false, allowed: false });
    });
    return () => { active = false; };
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;
  if (state.checking) return <div className="min-h-screen grid place-items-center text-slate-500">Memeriksa akses admin...</div>;
  return state.allowed ? <Outlet /> : <Navigate to="/" replace />;
}
