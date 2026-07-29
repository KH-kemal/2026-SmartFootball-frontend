import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import TeamList from './pages/teams/TeamList';
import TeamDetail from './pages/teams/TeamDetail';
import PlayerList from './pages/players/PlayerList';
import PlayerDetail from './pages/players/PlayerDetail';
import FixtureList from './pages/fixtures/FixtureList';
import LeagueTable from './pages/league-table/LeagueTable';
import Leaderboard from './pages/leaderboard/Leaderboard';
import Login from './pages/auth/Login';

import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import AdminTeams from './pages/admin/teams/AdminTeams';
import TeamCreate from './pages/admin/teams/TeamCreate';
import TeamEdit from './pages/admin/teams/TeamEdit';
import AdminPlayers from './pages/admin/players/AdminPlayers';
import PlayerCreate from './pages/admin/players/PlayerCreate';
import PlayerEdit from './pages/admin/players/PlayerEdit';
import AdminFixtures from './pages/admin/fixtures/AdminFixtures';
import FixtureCreate from './pages/admin/fixtures/FixtureCreate';
import FixtureEdit from './pages/admin/fixtures/FixtureEdit';
import AdminPlayerStats from './pages/admin/player-stats/AdminPlayerStats';
import PlayerStatCreate from './pages/admin/player-stats/PlayerStatCreate';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Navigate to="/teams" replace />} />
          <Route path="/teams" element={<TeamList />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/players" element={<PlayerList />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/fixtures" element={<FixtureList />} />
          <Route path="/league-table" element={<LeagueTable />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="teams" element={<AdminTeams />} />
            <Route path="teams/create" element={<TeamCreate />} />
            <Route path="teams/:id/edit" element={<TeamEdit />} />
            <Route path="players" element={<AdminPlayers />} />
            <Route path="players/create" element={<PlayerCreate />} />
            <Route path="players/:id/edit" element={<PlayerEdit />} />
            <Route path="fixtures" element={<AdminFixtures />} />
            <Route path="fixtures/create" element={<FixtureCreate />} />
            <Route path="fixtures/:id/edit" element={<FixtureEdit />} />
            <Route path="player-stats" element={<AdminPlayerStats />} />
            <Route path="player-stats/create" element={<PlayerStatCreate />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}