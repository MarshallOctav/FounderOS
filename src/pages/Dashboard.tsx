import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  ArrowUpRight, 
  Building2,
  CheckCircle2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardData {
  companies: any[];
  recentTasks: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/dashboard')
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Gagal memuat data dari server');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="p-12 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-indigo-250 border-t-indigo-600 rounded-full animate-spin" />
      <span className="text-slate-500 font-medium text-sm animate-pulse">Loading FounderOS...</span>
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
        <p className="text-rose-600 font-semibold mb-2">Gagal Memuat Dashboard</p>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const totalPipeline = data?.companies.reduce((acc, c) => acc + (c.pipeline_value || 0), 0) || 0;
  const totalProjects = data?.companies.reduce((acc, c) => acc + (c.project_count || 0), 0) || 0;

  const chartData = data?.companies.map(c => ({
    name: c.name,
    value: c.pipeline_value || 0
  })) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSignIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Pipeline Value</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            ${totalPipeline.toLocaleString()}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Active Projects</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">{totalProjects}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Companies Managed</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">{data?.companies.length}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Pipeline by Company</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Tasks</h3>
          <div className="space-y-4">
            {data?.recentTasks.map((task, i) => (
              <div key={task.id} className="flex items-start gap-3 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="mt-1">
                  <CheckCircle2 className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{task.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{task.project_name} • {task.status}</p>
                </div>
              </div>
            ))}
            {data?.recentTasks.length === 0 && (
              <p className="text-slate-400 text-sm">No active tasks.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DollarSignIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
