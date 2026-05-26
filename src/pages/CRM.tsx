import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  DollarSign,
  Briefcase
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  value: number;
  company_name: string;
}

export default function CRM() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCRM = () => {
    setLoading(true);
    setError(null);
    fetch('/api/crm')
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setContacts(data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Gagal memuat CRM dari server');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCRM();
  }, []);

  if (loading) return (
    <div className="p-12 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-indigo-250 border-t-indigo-600 rounded-full animate-spin" />
      <span className="text-slate-500 font-medium text-sm animate-pulse">Loading CRM...</span>
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
        <p className="text-rose-600 font-semibold mb-2">Gagal Memuat CRM</p>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button 
          onClick={fetchCRM} 
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
          <h1 className="text-2xl font-bold text-slate-900">Sales CRM</h1>
          <p className="text-slate-500 mt-1">Manage leads, customers, and deal pipelines.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button className="px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Value</th>
              <th className="px-6 py-3">Company Unit</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                      {contact.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{contact.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        {contact.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {contact.email}</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${contact.type === 'lead' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}
                  `}>
                    {contact.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  ${contact.value?.toLocaleString() || '0'}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {contact.company_name}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No contacts found. Add your first lead to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
