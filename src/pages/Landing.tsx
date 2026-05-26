import {
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Database,
  Gauge,
  LockKeyhole,
  Menu,
  MessageSquareText,
  PanelsTopLeft,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import BrandLogo from '@/components/BrandLogo';
import DarkModeToggle from '@/components/DarkModeToggle';

const navLinks = [
  { label: 'Produk', href: '#produk' },
  { label: 'Solusi', href: '#solusi' },
  { label: 'Demo', href: '#demo' },
  { label: 'Testimoni', href: '#testimoni' },
];

const metrics = [
  { value: '5', label: 'modul inti' },
  { value: 'Free', label: 'untuk mulai' },
  { value: 'Local', label: 'data browser' },
];

const appModules = [
  {
    icon: Building2,
    title: 'Company OS',
    text: 'Kelola holding, unit bisnis, dan relasi antar entitas tanpa spreadsheet berantakan.',
  },
  {
    icon: Workflow,
    title: 'Project cockpit',
    text: 'Lihat inisiatif aktif, status eksekusi, dan prioritas yang harus dibereskan minggu ini.',
  },
  {
    icon: Users,
    title: 'CRM pipeline',
    text: 'Pantau lead, customer, nilai deal, dan follow-up penting dalam satu alur kerja.',
  },
  {
    icon: CircleDollarSign,
    title: 'Finance desk',
    text: 'Catat cashflow, cek profit, dan export report tanpa setup software berat.',
  },
  {
    icon: Bot,
    title: 'AI Advisor',
    text: 'Minta sudut pandang cepat untuk strategi, operasi, sales, dan keputusan founder.',
  },
  {
    icon: LockKeyhole,
    title: 'Local-first',
    text: 'Data demo tersimpan di localStorage browser, cocok untuk eksplorasi cepat dan gratis.',
  },
];

const problemSolutions = [
  {
    icon: Database,
    problem: 'Operasi bisnis tercecer',
    detail: 'Company, project, CRM, dan finance sering hidup di tempat berbeda.',
    solution: 'FounderOS menyatukan konteks inti dalam satu dashboard yang mudah discan.',
  },
  {
    icon: Gauge,
    problem: 'Founder sulit menentukan fokus',
    detail: 'Banyak aktivitas berjalan, tetapi tidak semua berdampak ke revenue atau runway.',
    solution: 'Setiap modul menonjolkan pipeline, status, dan action yang perlu diprioritaskan.',
  },
  {
    icon: MessageSquareText,
    problem: 'Follow-up mudah hilang',
    detail: 'Keputusan meeting sering tersimpan di chat dan sulit dilacak lagi.',
    solution: 'Project, CRM, dan AI Advisor membantu menjaga konteks agar tim bergerak rapi.',
  },
];

const testimonials = [
  {
    quote: 'FounderOS membuat weekly review kami jauh lebih tajam. Semua keputusan punya konteks yang sama.',
    name: 'Alya Prameswari',
    role: 'CEO, Orbit Labs',
  },
  {
    quote: 'Pipeline, project, dan CRM akhirnya bisa dibaca dalam satu layar. Tim tidak lagi bolak-balik tools.',
    name: 'Raka Mahendra',
    role: 'Founder, Vista Commerce',
  },
  {
    quote: 'Kami pakai ini untuk memantau beberapa unit bisnis. Rasanya seperti command center yang ringan.',
    name: 'Nadine Putri',
    role: 'Managing Partner, Northstar Studio',
  },
  {
    quote: 'AI Advisor membantu kami menyiapkan agenda dan risiko sebelum meeting penting dengan cepat.',
    name: 'Dimas Ardiansyah',
    role: 'COO, ScaleWorks',
  },
];

const heroStats = [
  { label: 'Pipeline', value: '$308k', icon: TrendingUp },
  { label: 'Projects', value: '25', icon: Briefcase },
  { label: 'Entities', value: '8', icon: Building2 },
];

const footerGroups = [
  {
    title: 'Produk',
    links: [
      { label: 'Tentang aplikasi', href: '#produk' },
      { label: 'Solusi founder', href: '#solusi' },
      { label: 'Demo tampilan', href: '#demo' },
      { label: 'Testimoni', href: '#testimoni' },
    ],
  },
  {
    title: 'Fitur',
    links: [
      { label: 'Company OS', href: '/auth' },
      { label: 'Project cockpit', href: '/auth' },
      { label: 'CRM pipeline', href: '/auth' },
      { label: 'Finance desk', href: '/auth' },
    ],
  },
  {
    title: 'Mulai',
    links: [
      { label: 'Masuk', href: '/auth' },
      { label: 'Coba demo gratis', href: '/auth' },
      { label: 'AI Advisor', href: '/auth' },
      { label: 'Local storage demo', href: '/auth' },
    ],
  },
];

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="FounderOS home">
            <BrandLogo className="h-9 w-9 shadow-indigo-200" />
            <span className="text-lg font-bold">FounderOS</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-700">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <DarkModeToggle />
            <Link to="/auth" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">
              Masuk
            </Link>
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 sm:px-4 sm:text-sm">
              Coba gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  {link.label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/auth" className="rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700">
                  Masuk
                </Link>
                <Link to="/auth" className="rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white">
                  Coba gratis
                </Link>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-sm font-semibold text-slate-700">Tema</span>
                <DarkModeToggle />
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:py-16">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-800">
                <Sparkles className="h-4 w-4" />
                SaaS founder toolkit yang bisa dicoba gratis
              </div>
              <h1 className="text-wrap-safe text-3xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Operating system ringan untuk founder yang ingin bisnisnya lebih rapi.
              </h1>
              <p className="text-wrap-safe mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                FounderOS menyatukan company, project, CRM, finance, dan AI Advisor dalam satu workspace yang cepat dipakai tanpa setup rumit.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/auth" className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 sm:px-5 sm:py-3 sm:text-sm">
                  Masuk sebagai demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#demo" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-50 sm:px-5 sm:py-3 sm:text-sm">
                  Lihat tampilan
                  <PanelsTopLeft className="h-4 w-4" />
                </a>
              </div>
              <div className="mobile-odd-span mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
                {metrics.map((item) => (
                  <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
                    <p className="text-xl font-bold text-slate-950 sm:text-2xl">{item.value}</p>
                    <p className="text-wrap-safe mt-1 text-xs text-slate-500 sm:text-sm">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <HeroPreview />
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50 py-12">
          <div className="mobile-odd-span mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            {[
              ['Local-first', 'Data demo tetap tersimpan di browser.'],
              ['Gratis dicoba', 'Masuk sebagai demo tanpa akun berbayar.'],
              ['SaaS-ready', 'UI rapi untuk operasi harian founder.'],
            ].map(([title, text]) => (
              <div key={title} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:gap-3 sm:p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600" />
                <div>
                  <p className="text-wrap-safe text-sm font-bold text-slate-950 sm:text-base">{title}</p>
                  <p className="text-wrap-safe mt-1 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="produk" className="border-b border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionIntro
              eyebrow="Tentang aplikasi"
              title="Satu workspace untuk membaca bisnis dari strategi sampai eksekusi."
              text="FounderOS dibuat untuk founder, operator, dan tim kecil yang butuh command center praktis tanpa biaya software yang berat di awal."
            />

            <div className="mobile-odd-span mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {appModules.map((item) => (
                <div key={item.title} className="group rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-5">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 sm:h-11 sm:w-11">
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="text-wrap-safe text-sm font-bold text-slate-950 sm:text-base">{item.title}</h3>
                  <p className="text-wrap-safe mt-2 text-xs leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-6">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="solusi" className="border-b border-slate-200 bg-slate-50 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
            <SectionIntro
              eyebrow="Masalah dan solusi"
              title="Lebih sedikit chaos, lebih banyak keputusan yang bisa dieksekusi."
              text="Daripada menambah tool baru yang rumit, FounderOS mengumpulkan hal paling penting agar founder bisa review bisnis dengan cepat."
            />

            <div className="space-y-4">
              {problemSolutions.map((item, index) => (
                <div key={item.problem} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="grid flex-1 gap-4 md:grid-cols-[0.95fr_1.05fr]">
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500">Masalah {index + 1}</p>
                        <h3 className="text-wrap-safe mt-2 font-bold text-slate-950">{item.problem}</h3>
                        <p className="text-wrap-safe mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                      </div>
                      <div className="rounded-lg bg-indigo-50 p-4">
                        <p className="text-xs font-bold uppercase text-indigo-700">Solusi FounderOS</p>
                        <p className="text-wrap-safe mt-2 text-sm leading-6 text-slate-700">{item.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="border-b border-slate-200 bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <SectionIntro
                eyebrow="Demo tampilan"
                title="Desktop untuk review mendalam, mobile untuk cek cepat."
                text="Tampilan dibuat padat, bersih, dan mudah discan seperti produk SaaS operasional."
                dark
              />
              <Link to="/auth" className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-indigo-50 sm:px-5 sm:py-3 sm:text-sm">
                Coba demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid items-end gap-6 lg:grid-cols-[1fr_340px]">
              <DesktopDemo />
              <MobileDemo />
            </div>
          </div>
        </section>

        <section id="testimoni" className="border-b border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionIntro
              eyebrow="Testimoni"
              title="Dibuat untuk ritme kerja founder yang cepat."
              text="Landing ini menampilkan contoh penggunaan oleh tim yang butuh operasi lebih rapi sejak hari pertama."
            />

            <div className="mobile-odd-span mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {testimonials.map((item) => (
                <figure key={item.name} className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-5">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-700 shadow-sm sm:h-10 sm:w-10">
                    <MessageSquareText className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <blockquote className="text-wrap-safe text-xs leading-5 text-slate-700 sm:text-sm sm:leading-6">"{item.quote}"</blockquote>
                  <figcaption className="mt-5 border-t border-slate-200 pt-4">
                    <p className="text-wrap-safe text-sm font-bold text-slate-950 sm:text-base">{item.name}</p>
                    <p className="text-wrap-safe mt-1 text-xs text-slate-500 sm:text-sm">{item.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 rounded-lg border border-indigo-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:p-10">
              <div>
                <p className="text-sm font-bold uppercase text-indigo-700">Gratis untuk mulai</p>
                <h2 className="text-wrap-safe mt-3 text-2xl font-bold text-slate-950 sm:text-4xl">
                  Pakai demo FounderOS dan rapikan operasi bisnis hari ini.
                </h2>
                <p className="text-wrap-safe mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Cocok untuk founder yang ingin dashboard SaaS sederhana sebelum berinvestasi ke sistem yang lebih besar.
                </p>
              </div>
              <Link to="/auth" className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 sm:px-5 sm:py-3 sm:text-sm">
                Masuk sebagai demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_2fr] lg:px-8 lg:py-12">
          <div>
            <div className="flex items-center gap-3">
              <BrandLogo className="h-10 w-10" />
              <div>
                <p className="font-bold text-slate-950">FounderOS</p>
                <p className="text-sm text-slate-500">Free SaaS toolkit for founder operations.</p>
              </div>
            </div>
            <p className="text-wrap-safe mt-5 max-w-sm text-sm leading-6 text-slate-600">
              Workspace gratis untuk founder yang ingin merapikan company, project, CRM, finance, dan AI Advisor dalam satu dashboard.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/auth" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700">
                Coba demo
              </Link>
              <a href="http://founderos.optibis.io/" className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                founderos.optibis.io
              </a>
            </div>
          </div>

          <div className="mobile-odd-span grid grid-cols-2 gap-6 md:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-bold text-slate-950">{group.title}</h3>
                <div className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    link.href.startsWith('/') ? (
                      <Link key={link.label} to={link.href} className="block text-sm font-medium text-slate-500 hover:text-indigo-700">
                        {link.label}
                      </Link>
                    ) : (
                      <a key={link.label} href={link.href} className="block text-sm font-medium text-slate-500 hover:text-indigo-700">
                        {link.label}
                      </a>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-200">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs font-medium text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <p>© 2026 FounderOS. Built as a free founder operating toolkit.</p>
            <div className="flex flex-wrap gap-4">
              <span>Local-first demo</span>
              <span>Dark mode</span>
              <span>SEO ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionIntro({ eyebrow, title, text, dark = false }: { eyebrow: string; title: string; text: string; dark?: boolean }) {
  return (
    <div className="max-w-3xl">
      <p className={`text-sm font-bold uppercase ${dark ? 'text-indigo-200' : 'text-indigo-700'}`}>{eyebrow}</p>
      <h2 className={`text-wrap-safe mt-3 text-2xl font-bold sm:text-4xl ${dark ? 'text-white' : 'text-slate-950'}`}>{title}</h2>
      <p className={`text-wrap-safe mt-4 text-base leading-7 sm:text-lg sm:leading-8 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{text}</p>
    </div>
  );
}

function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="rounded-lg border border-slate-200 bg-slate-950 p-2 shadow-2xl sm:p-3">
        <div className="overflow-hidden rounded-lg bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-8 w-8 sm:h-9 sm:w-9" />
              <div>
                <p className="text-wrap-safe text-xs font-bold text-slate-950 sm:text-sm">FounderOS Workspace</p>
                <p className="text-xs text-slate-500">Today, 26 Mei 2026</p>
              </div>
            </div>
            <span className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700 sm:px-3">Free</span>
          </div>

          <div className="grid gap-3 p-3 sm:gap-4 sm:p-5 lg:grid-cols-[1fr_280px]">
            <div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                {heroStats.map((item) => (
                  <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase text-slate-500">{item.label}</p>
                      <item.icon className="h-4 w-4 text-indigo-500" />
                    </div>
                    <p className="mt-2 text-xl font-bold text-slate-950 sm:mt-3 sm:text-2xl">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-lg border border-slate-200 p-3 sm:mt-4 sm:p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">Pipeline by Company</p>
                  <BarChart3 className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex h-36 items-end gap-2 sm:h-48 sm:gap-3">
                  {[58, 82, 46, 74, 64, 92, 52, 76].map((height, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-t-lg bg-indigo-500" style={{ height: `${height}%` }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-3 sm:p-4">
                <p className="text-sm font-bold text-slate-900">Priority Queue</p>
                <div className="mt-4 space-y-3">
                  {['Investor memo', 'Q3 hiring plan', 'CRM follow-up'].map((task, index) => (
                    <div key={task} className="flex items-center gap-3">
                      <span className={`h-8 w-1.5 rounded-full ${index === 0 ? 'bg-indigo-600' : index === 1 ? 'bg-indigo-400' : 'bg-slate-300'}`} />
                      <div>
                        <p className="text-wrap-safe text-sm font-semibold text-slate-800">{task}</p>
                        <p className="text-xs text-slate-500">Due this week</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-slate-950 p-3 text-white sm:p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Bot className="h-4 w-4 text-indigo-300" />
                  <p className="text-sm font-bold">AI Advisor</p>
                </div>
                <p className="text-wrap-safe text-sm leading-6 text-slate-300">Prioritaskan renewal enterprise dan follow-up lead bernilai tinggi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DesktopDemo() {
  return (
    <figure className="rounded-lg border border-white/10 bg-white/10 p-2 shadow-2xl sm:p-3">
      <div className="overflow-hidden rounded-lg bg-white">
        <img
          src="/desktop-demo.png"
          alt="Tampilan desktop FounderOS dashboard untuk company, project, CRM, finance, dan AI Advisor"
          className="block aspect-[16/8] w-full object-cover object-left-top"
          loading="lazy"
          width="1920"
          height="938"
        />
        <div className="border-t border-slate-200 bg-white px-3 py-3 text-slate-950 sm:px-4">
          <figcaption className="text-wrap-safe text-sm font-bold">Desktop dashboard</figcaption>
          <p className="text-wrap-safe mt-1 text-xs text-slate-500 sm:text-sm">
            Review pipeline, project, task, dan finance dalam tampilan kerja yang padat.
          </p>
        </div>
      </div>
    </figure>
  );
}

function MobileDemo() {
  return (
    <figure className="mx-auto w-full max-w-[320px] rounded-[28px] border border-white/20 bg-slate-900 p-3 shadow-2xl">
      <div className="overflow-hidden rounded-[22px] bg-white text-slate-950">
        <img
          src="/desktop-mobile.png"
          alt="Tampilan mobile FounderOS untuk mengelola project dan dashboard founder"
          className="block aspect-[9/16] w-full object-cover object-top"
          loading="lazy"
          width="382"
          height="849"
        />
        <figcaption className="border-t border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-950">
          Mobile workflow
        </figcaption>
      </div>
    </figure>
  );
}
