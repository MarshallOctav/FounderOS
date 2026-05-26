import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Projects from './pages/Projects';
import CRM from './pages/CRM';
import Finance from './pages/Finance';
import AIAdvisor from './pages/AIAdvisor';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="companies" element={<Companies />} />
            <Route path="projects" element={<Projects />} />
            <Route path="crm" element={<CRM />} />
            <Route path="finance" element={<Finance />} />
            <Route path="ai" element={<AIAdvisor />} />
            <Route path="*" element={<div className="p-8 text-slate-500">Module coming soon...</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
