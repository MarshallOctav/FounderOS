import { useEffect, useState } from 'react';
import { Save, UserRound } from 'lucide-react';
import { readSession, writeSession } from '@/lib/localStore';

export default function Settings() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    workspace: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const session = readSession();
    if (!session) return;
    setForm(session);
  }, []);

  const handleSave = () => {
    writeSession({
      name: form.name.trim() || 'Demo Founder',
      email: form.email.trim() || 'founder@founderos.local',
      workspace: form.workspace.trim() || 'FounderOS Workspace',
    });
    window.dispatchEvent(new Event('founderos:session-updated'));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 md:mb-8">
        <h1 className="text-xl font-bold text-slate-900 md:text-2xl">Settings</h1>
        <p className="text-wrap-safe mt-1 text-sm text-slate-500 md:text-base">Kelola profil lokal yang tersimpan di browser ini.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Workspace Profile</h2>
            <p className="text-wrap-safe text-sm text-slate-500">Perubahan langsung disimpan ke localStorage.</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Workspace</span>
            <input value={form.workspace} onChange={(event) => setForm({ ...form, workspace: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-wrap-safe text-xs text-slate-500 md:text-sm">{saved ? 'Saved to localStorage.' : 'Data tetap ada setelah browser direfresh.'}</p>
          <button onClick={handleSave} className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 md:px-4 md:text-base">
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
