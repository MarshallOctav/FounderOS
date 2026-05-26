import React, { useEffect, useState } from 'react';
import { 
  Kanban, 
  List, 
  Calendar, 
  Plus, 
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface Project {
  id: string;
  name: string;
  status: string;
  task_count: number;
  company_name: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = () => {
    setLoading(true);
    setError(null);
    fetch('/api/projects')
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Gagal memuat proyek dari server');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return (
    <div className="p-12 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-indigo-250 border-t-indigo-600 rounded-full animate-spin" />
      <span className="text-slate-500 font-medium text-sm animate-pulse">Loading Projects...</span>
    </div>
  );

  if (error) {
    return (
      <div className="p-8 max-w-lg mx-auto bg-white rounded-xl border border-rose-100 shadow-sm text-center my-8">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="text-rose-600 font-semibold mb-2">Gagal Memuat Daftar Proyek</p>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button 
          onClick={fetchProjects} 
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-1">Track progress across all business units.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-lg border border-slate-200 p-1">
            <button className="p-2 bg-slate-100 rounded text-slate-900"><Kanban className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-slate-50 rounded text-slate-500"><List className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-slate-50 rounded text-slate-500"><Calendar className="w-4 h-4" /></button>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['active', 'planning', 'completed'].map((status) => (
          <div key={status} className="bg-slate-50 rounded-xl p-4 min-h-[500px]">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-semibold text-slate-700 capitalize flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  status === 'active' ? 'bg-emerald-500' : 
                  status === 'planning' ? 'bg-blue-500' : 'bg-slate-400'
                }`} />
                {status}
              </h3>
              <span className="text-xs font-medium text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                {projects.filter(p => p.status === status).length}
              </span>
            </div>

            <div className="space-y-3">
              {projects.filter(p => p.status === status).map((project) => (
                <motion.div
                  layoutId={project.id}
                  key={project.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {project.company_name}
                    </span>
                    <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-medium text-slate-900 mb-3">{project.name}</h4>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-50 pt-3">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{project.task_count} tasks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due in 3 days</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
