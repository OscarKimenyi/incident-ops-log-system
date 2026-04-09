import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IncidentList from './pages/IncidentList';
import IncidentDetail from './pages/IncidentDetail';
import CreateIncident from './pages/CreateIncident';
import UserManagement from './pages/UserManagement';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/incidents" element={
            <ProtectedRoute>
              <Layout><IncidentList /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/incidents/create" element={
            <ProtectedRoute>
              <Layout><CreateIncident /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/incidents/:id" element={
            <ProtectedRoute>
              <Layout><IncidentDetail /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute roles={['admin']}>
              <Layout><UserManagement /></Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}