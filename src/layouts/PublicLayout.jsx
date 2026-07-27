import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PublicLayout() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} KickRank. All rights reserved.
      </footer>
    </div>
  );
}