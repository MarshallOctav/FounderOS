import { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Briefcase,
  X,
  Trash2
} from 'lucide-react';
import { createId, getCompanyName, readFounderData, updateFounderData, type Company } from '@/lib/localStore';

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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'lead' | 'customer'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'lead',
    status: 'new',
    value: '0',
    company_id: '',
  });

  const hydrateCRM = () => {
    const storedData = readFounderData();
    setCompanies(storedData.companies);
    setContacts(storedData.contacts.map((contact) => ({
      ...contact,
      company_name: getCompanyName(storedData, contact.company_id),
    })));
    setNewContact((current) => ({
      ...current,
      company_id: current.company_id || storedData.companies[0]?.id || '',
    }));
  };

  const fetchCRM = () => {
    setLoading(true);
    setError(null);
    try {
      hydrateCRM();
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal memuat CRM lokal');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!newContact.name.trim() || !newContact.company_id) return;

    updateFounderData((data) => ({
      ...data,
      contacts: [
        ...data.contacts,
        {
          id: createId('contact'),
          company_id: newContact.company_id,
          name: newContact.name.trim(),
          email: newContact.email.trim(),
          phone: newContact.phone.trim(),
          type: newContact.type as 'lead' | 'customer',
          status: newContact.status.trim() || 'new',
          value: Number(newContact.value) || 0,
        },
      ],
    }));
    hydrateCRM();
    setNewContact({ name: '', email: '', phone: '', type: 'lead', status: 'new', value: '0', company_id: companies[0]?.id || '' });
    setIsModalOpen(false);
  };

  const handleDelete = (contactId: string) => {
    updateFounderData((data) => ({
      ...data,
      contacts: data.contacts.filter((contact) => contact.id !== contactId),
    }));
    hydrateCRM();
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

  const visibleContacts = contacts.filter((contact) => {
    const matchesSearch = [contact.name, contact.email, contact.company_name]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || contact.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-5 flex items-start justify-between gap-3 md:mb-8 md:items-center">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 md:text-2xl">Sales CRM</h1>
          <p className="text-wrap-safe mt-1 text-sm text-slate-500 md:text-base">Manage leads, customers, and deal pipelines.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700 md:gap-2 md:px-4 md:text-base">
          <Users className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 p-3 md:gap-4 md:p-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search contacts..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button onClick={() => setFilter((current) => current === 'all' ? 'lead' : current === 'lead' ? 'customer' : 'all')} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 md:gap-2 md:text-sm">
            <Filter className="w-4 h-4" />
            {filter === 'all' ? 'All' : filter}
          </button>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
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
            {visibleContacts.map((contact) => (
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
                  <button onClick={() => handleDelete(contact.id)} className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {visibleContacts.length === 0 && (
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <h3 className="font-semibold text-slate-900">Add Contact</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <input value={newContact.name} onChange={(event) => setNewContact({ ...newContact, name: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Contact name" />
              <input value={newContact.email} onChange={(event) => setNewContact({ ...newContact, email: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Email" />
              <input value={newContact.phone} onChange={(event) => setNewContact({ ...newContact, phone: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Phone" />
              <div className="grid grid-cols-2 gap-3">
                <select value={newContact.type} onChange={(event) => setNewContact({ ...newContact, type: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="lead">Lead</option>
                  <option value="customer">Customer</option>
                </select>
                <input value={newContact.value} onChange={(event) => setNewContact({ ...newContact, value: event.target.value })} type="number" className="rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Deal value" />
              </div>
              <select value={newContact.company_id} onChange={(event) => setNewContact({ ...newContact, company_id: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 p-4">
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 font-medium text-slate-600 hover:bg-slate-200">Cancel</button>
              <button onClick={handleCreate} disabled={!newContact.name.trim()} className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
