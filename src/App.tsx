import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Projects from './pages/Projects';
import CRM from './pages/CRM';
import Finance from './pages/Finance';
import AIAdvisor from './pages/AIAdvisor';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/companies" element={<Navigate to="/dashboard/companies" replace />} />
          <Route path="/projects" element={<Navigate to="/dashboard/projects" replace />} />
          <Route path="/crm" element={<Navigate to="/dashboard/crm" replace />} />
          <Route path="/finance" element={<Navigate to="/dashboard/finance" replace />} />
          <Route path="/ai" element={<Navigate to="/dashboard/ai" replace />} />
          <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="companies" element={<Companies />} />
            <Route path="projects" element={<Projects />} />
            <Route path="crm" element={<CRM />} />
            <Route path="finance" element={<Finance />} />
            <Route path="ai" element={<AIAdvisor />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<div className="p-8 text-slate-500">Module coming soon...</div>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
