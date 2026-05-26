import { useEffect, useState } from 'react';
import { 
  Kanban, 
  List, 
  Calendar, 
  Plus, 
  Clock,
  CheckCircle2,
  Trash2,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { createId, getCompanyName, getProjectTaskCount, readFounderData, updateFounderData, type Company } from '@/lib/localStore';

interface Project {
  id: string;
  name: string;
  status: string;
  task_count: number;
  company_id: string;
  company_name: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', status: 'planning', company_id: '' });

  const hydrateProjects = () => {
    const storedData = readFounderData();
    setCompanies(storedData.companies);
    setProjects(storedData.projects.map((project) => ({
      ...project,
      task_count: getProjectTaskCount(storedData, project.id),
      company_name: getCompanyName(storedData, project.company_id),
    })));
    setNewProject((current) => ({
      ...current,
      company_id: current.company_id || storedData.companies[0]?.id || '',
    }));
  };

  const fetchProjects = () => {
    setLoading(true);
    setError(null);
    try {
      hydrateProjects();
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal memuat proyek lokal');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!newProject.name.trim() || !newProject.company_id) return;

    updateFounderData((data) => ({
      ...data,
      projects: [
        ...data.projects,
        {
          id: createId('project'),
          name: newProject.name.trim(),
          status: newProject.status as 'active' | 'planning' | 'completed',
          company_id: newProject.company_id,
        },
      ],
    }));
    hydrateProjects();
    setNewProject({ name: '', status: 'planning', company_id: companies[0]?.id || '' });
    setIsModalOpen(false);
  };

  const handleDelete = (projectId: string) => {
    updateFounderData((data) => ({
      ...data,
      projects: data.projects.filter((project) => project.id !== projectId),
      tasks: data.tasks.filter((task) => task.project_id !== projectId),
    }));
    hydrateProjects();
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
    <div className="mx-auto max-w-7xl">
      <div className="mb-5 flex items-start justify-between gap-3 md:mb-8 md:items-center">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 md:text-2xl">Projects</h1>
          <p className="text-wrap-safe mt-1 text-sm text-slate-500 md:text-base">Track progress across all business units.</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2 md:gap-3">
          <div className="flex bg-white rounded-lg border border-slate-200 p-1">
            <button onClick={() => setViewMode('kanban')} className={`p-2 rounded ${viewMode === 'kanban' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}><Kanban className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}><List className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('calendar')} className={`p-2 rounded ${viewMode === 'calendar' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}><Calendar className="w-4 h-4" /></button>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700 md:gap-2 md:px-4 md:text-base">
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 md:px-5 md:py-4">
              <div className="min-w-0">
                <p className="text-wrap-safe font-semibold text-slate-900">{project.name}</p>
                <p className="text-wrap-safe text-xs text-slate-500 md:text-sm">{project.company_name} • {project.status}</p>
              </div>
              <button onClick={() => handleDelete(project.id)} className="p-2 text-slate-400 hover:text-rose-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <h3 className="font-semibold text-slate-900 mb-4">This month</h3>
          <div className="grid min-w-[620px] grid-cols-7 gap-2 text-center text-sm">
            {Array.from({ length: 35 }, (_, index) => (
              <div key={index} className="min-h-20 rounded-lg border border-slate-100 bg-slate-50 p-2 text-left">
                <span className="text-xs text-slate-400">{index + 1}</span>
                {projects[index % projects.length] && index < projects.length * 2 && (
                  <p className="mt-2 rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">{projects[index % projects.length].name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'kanban' && <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {['active', 'planning', 'completed'].map((status) => (
          <div key={status} className="min-h-[280px] rounded-xl bg-slate-50 p-3 md:min-h-[500px] md:p-4">
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
                  className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md md:p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {project.company_name}
                    </span>
                    <button onClick={() => handleDelete(project.id)} className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="text-wrap-safe mb-3 text-sm font-medium text-slate-900 md:text-base">{project.name}</h4>
                  
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
      </div>}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <h3 className="font-semibold text-slate-900">Create Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Project Name</span>
                <input value={newProject.name} onChange={(event) => setNewProject({ ...newProject, name: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Investor memo sprint" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Company</span>
                <select value={newProject.company_id} onChange={(event) => setNewProject({ ...newProject, company_id: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
                <select value={newProject.status} onChange={(event) => setNewProject({ ...newProject, status: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 p-4">
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 font-medium text-slate-600 hover:bg-slate-200">Cancel</button>
              <button onClick={handleCreate} disabled={!newProject.name.trim()} className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
