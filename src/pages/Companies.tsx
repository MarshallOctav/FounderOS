import React, { useEffect, useState } from 'react';
import { Building2, Plus, ArrowRight, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Company {
  id: string;
  name: string;
  type: string;
  industry: string;
  project_count: number;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', type: 'subsidiary', industry: '' });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    setLoading(true);
    setError(null);
    fetch('/api/companies')
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setCompanies(data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Gagal memuat data dari server');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCreate = async () => {
    if (!newCompany.name) return;

    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany)
      });
      
      if (res.ok) {
        const created = await res.json();
        setCompanies([...companies, created]);
        setIsModalOpen(false);
        setNewCompany({ name: '', type: 'subsidiary', industry: '' });
      }
    } catch (error) {
      console.error("Failed to create company", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) return;
    
    try {
      const res = await fetch(`/api/companies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCompanies(companies.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete company", error);
    }
  };

  if (loading) return (
    <div className="p-12 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-indigo-250 border-t-indigo-600 rounded-full animate-spin" />
      <span className="text-slate-500 font-medium text-sm animate-pulse">Loading Companies...</span>
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
        <p className="text-rose-600 font-semibold mb-2">Gagal Memuat Daftar Perusahaan</p>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button 
          onClick={fetchCompanies} 
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Holding Structure</h1>
          <p className="text-slate-500 mt-1">Manage your portfolio of companies and business units.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Entity</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative"
          >
            <button 
              onClick={() => handleDelete(company.id)}
              className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                company.type === 'holding' ? 'bg-purple-100 text-purple-700' : 
                company.type === 'subsidiary' ? 'bg-blue-100 text-blue-700' : 
                'bg-slate-100 text-slate-700'
              }`}>
                {company.type.replace('_', ' ')}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">{company.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{company.industry || 'General Industry'}</p>
            
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Projects</p>
                <p className="text-lg font-semibold text-slate-900 flex items-center gap-1">
                  {company.project_count}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Health</p>
                <p className="text-lg font-semibold text-emerald-600 flex items-center gap-1">
                  98%
                </p>
              </div>
            </div>

            <button className="w-full mt-2 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center gap-1">
              View Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Add New Entity</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                  <input 
                    type="text" 
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select 
                    value={newCompany.type}
                    onChange={(e) => setNewCompany({...newCompany, type: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="holding">Holding Company</option>
                    <option value="subsidiary">Subsidiary</option>
                    <option value="business_unit">Business Unit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                  <input 
                    type="text" 
                    value={newCompany.industry}
                    onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. SaaS, E-commerce"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreate}
                  disabled={!newCompany.name}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  Create Entity
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
