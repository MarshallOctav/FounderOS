import { useEffect, useState } from 'react';
import { Building2, Plus, ArrowRight, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { createId, getCompanyProjectCount, readFounderData, updateFounderData } from '@/lib/localStore';

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
    try {
      const storedData = readFounderData();
      setCompanies(storedData.companies.map((company) => ({
        ...company,
        project_count: getCompanyProjectCount(storedData, company.id),
      })));
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal memuat data lokal');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!newCompany.name) return;

    const created = {
      id: createId('company'),
      ...newCompany,
      project_count: 0,
    };
    updateFounderData((data) => ({
      ...data,
      companies: [...data.companies, { id: created.id, name: created.name, type: created.type, industry: created.industry }],
    }));
    setCompanies([...companies, created]);
    setIsModalOpen(false);
    setNewCompany({ name: '', type: 'subsidiary', industry: '' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) return;

    updateFounderData((data) => {
      const deletedProjectIds = data.projects.filter((project) => project.company_id === id).map((project) => project.id);
      return {
        ...data,
        companies: data.companies.filter((company) => company.id !== id),
        projects: data.projects.filter((project) => project.company_id !== id),
        tasks: data.tasks.filter((task) => !deletedProjectIds.includes(task.project_id)),
        contacts: data.contacts.filter((contact) => contact.company_id !== id),
        transactions: data.transactions.filter((transaction) => transaction.company_id !== id),
      };
    });
    setCompanies(companies.filter(c => c.id !== id));
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
    <div className="relative mx-auto max-w-7xl">
      <div className="mb-5 flex items-start justify-between gap-3 md:mb-8 md:items-center">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 md:text-2xl">Holding Structure</h1>
          <p className="text-wrap-safe mt-1 text-sm text-slate-500 md:text-base">Manage your portfolio of companies and business units.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700 md:gap-2 md:px-4 md:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      <div className="mobile-odd-span grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {companies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md md:p-6"
          >
            <button 
              onClick={() => handleDelete(company.id)}
              className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between mb-4">
              <div className="rounded-lg bg-indigo-50 p-2 md:p-3">
                <Building2 className="h-5 w-5 text-indigo-600 md:h-6 md:w-6" />
              </div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-medium capitalize md:text-xs ${
                company.type === 'holding' ? 'bg-purple-100 text-purple-700' : 
                company.type === 'subsidiary' ? 'bg-blue-100 text-blue-700' : 
                'bg-slate-100 text-slate-700'
              }`}>
                {company.type.replace('_', ' ')}
              </span>
            </div>
            
            <h3 className="text-wrap-safe mb-1 text-sm font-bold text-slate-900 md:text-lg">{company.name}</h3>
            <p className="text-wrap-safe mb-3 text-xs text-slate-500 md:mb-4 md:text-sm">{company.industry || 'General Industry'}</p>
            
            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 py-3 md:gap-4 md:py-4">
              <div>
                <p className="text-[10px] font-medium uppercase text-slate-400 md:text-xs">Projects</p>
                <p className="flex items-center gap-1 text-base font-semibold text-slate-900 md:text-lg">
                  {company.project_count}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase text-slate-400 md:text-xs">Health</p>
                <p className="flex items-center gap-1 text-base font-semibold text-emerald-600 md:text-lg">
                  98%
                </p>
              </div>
            </div>

            <Link to="/dashboard/projects" className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 md:text-sm">
              View <ArrowRight className="h-4 w-4" />
            </Link>
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
