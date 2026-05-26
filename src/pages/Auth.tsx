import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { readFounderData, writeFounderData, writeSession } from '@/lib/localStore';
import BrandLogo from '@/components/BrandLogo';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    remember: true,
  });
  const navigate = useNavigate();

  const isRegister = mode === 'register';

  const completeAuth = (email: string, name: string) => {
    writeSession({
      name,
      email,
      workspace: isRegister ? `${name} Workspace` : 'FounderOS Workspace',
    });
    writeFounderData(readFounderData());
    navigate('/dashboard');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = form.email.trim() || 'founder@founderos.local';
    const name = form.name.trim() || email.split('@')[0] || 'Demo Founder';
    completeAuth(email, name);
  };

  const handleGoogleAuth = () => {
    completeAuth('founder@google.local', 'Google Founder');
  };

  const handleDemoLogin = () => {
    completeAuth('demo@founderos.local', 'Demo Founder');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo className="h-9 w-9" />
          <span className="text-lg font-bold">FounderOS</span>
        </Link>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <Link to="/" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-950 sm:text-sm">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-10">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase text-indigo-700">Founder workspace</p>
            <h1 className="text-wrap-safe mt-3 text-3xl font-bold leading-tight text-slate-950 xl:text-4xl">
              Masuk ke pusat kendali untuk company, project, CRM, finance, dan AI Advisor.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Akses workspace yang membantu tim menjaga konteks keputusan, follow-up, dan eksekusi harian.
            </p>
          </div>

          <div className="mt-10 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="font-bold text-slate-950">Workspace health</p>
                <p className="text-sm text-slate-500">Live operating summary</p>
              </div>
              <span className="rounded-lg bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700">Ready</span>
            </div>
            <div className="mt-5 grid gap-3">
              {[
                'Company structure synced',
                'Finance pipeline reviewed',
                'AI Advisor context available',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6">
              <p className="text-sm font-bold uppercase text-indigo-700">
              {isRegister ? 'Buat akun' : 'Selamat datang'}
            </p>
            <h2 className="text-wrap-safe mt-2 text-xl font-bold text-slate-950 sm:text-2xl">
              {isRegister ? 'Daftarkan workspace baru' : 'Masuk ke FounderOS'}
            </h2>
            <p className="text-wrap-safe mt-2 text-sm leading-6 text-slate-500">
              {isRegister
                ? 'Siapkan akses awal untuk mengelola operasi bisnis dalam satu tempat.'
                : 'Lanjutkan ke dashboard dan review kondisi bisnis terbaru.'}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${!isRegister ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${isRegister ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
            >
              Daftar
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isRegister && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Nama lengkap</span>
                <span className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                  <UserRound className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Nama founder"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </span>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <span className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                <Mail className="h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="founder@company.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <span className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                <LockKeyhole className="h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Minimal 8 karakter"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-slate-400 transition-colors hover:text-slate-700" aria-label="Toggle password visibility">
                  <Eye className="h-5 w-5" />
                </button>
              </span>
            </label>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(event) => setForm((current) => ({ ...current, remember: event.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Ingat saya
              </label>
              {!isRegister && (
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    alert('Reset link demo tersimpan untuk flow lokal. Silakan masuk dengan email apa pun.');
                  }}
                  className="font-semibold text-indigo-700 hover:text-indigo-800"
                >
                  Lupa password?
                </a>
              )}
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-indigo-700 sm:py-3 sm:text-sm"
            >
              {isRegister ? 'Buat workspace' : 'Masuk'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100 sm:py-3 sm:text-sm"
          >
            Masuk sebagai demo
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-bold uppercase text-slate-400">atau</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button type="button" onClick={handleGoogleAuth} className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 sm:py-3 sm:text-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-slate-950 text-[10px] font-bold text-white">G</span>
            Lanjutkan dengan Google
          </button>
        </section>
      </main>
    </div>
  );
}
