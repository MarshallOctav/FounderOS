export interface Company {
  id: string;
  name: string;
  type: string;
  industry: string;
}

export interface Project {
  id: string;
  company_id: string;
  name: string;
  status: 'active' | 'planning' | 'completed';
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  status: string;
  created_at: string;
}

export interface Contact {
  id: string;
  company_id: string;
  name: string;
  email: string;
  phone: string;
  type: 'lead' | 'customer';
  status: string;
  value: number;
}

export interface Transaction {
  id: string;
  company_id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface FounderData {
  companies: Company[];
  projects: Project[];
  tasks: Task[];
  contacts: Contact[];
  transactions: Transaction[];
}

export interface FounderSession {
  name: string;
  email: string;
  workspace: string;
}

const DATA_KEY = 'founderos:data:v1';
const SESSION_KEY = 'founderos:session:v1';

const seedData: FounderData = {
  companies: [
    { id: 'company_atlas', name: 'Atlas Retail', type: 'holding', industry: 'Commerce' },
    { id: 'company_nusa', name: 'Nusa Cloud', type: 'subsidiary', industry: 'SaaS' },
    { id: 'company_kinara', name: 'Kinara Studio', type: 'business_unit', industry: 'Creative' },
  ],
  projects: [
    { id: 'project_launch', company_id: 'company_atlas', name: 'Marketplace relaunch', status: 'active' },
    { id: 'project_crm', company_id: 'company_nusa', name: 'Enterprise CRM rollout', status: 'active' },
    { id: 'project_hiring', company_id: 'company_kinara', name: 'Creative hiring sprint', status: 'planning' },
    { id: 'project_brand', company_id: 'company_atlas', name: 'Brand refresh', status: 'completed' },
  ],
  tasks: [
    { id: 'task_1', project_id: 'project_launch', title: 'Review conversion funnel', status: 'in_progress', created_at: '2026-05-26T08:00:00.000Z' },
    { id: 'task_2', project_id: 'project_crm', title: 'Follow up enterprise leads', status: 'open', created_at: '2026-05-25T08:00:00.000Z' },
    { id: 'task_3', project_id: 'project_hiring', title: 'Finalize interview rubric', status: 'open', created_at: '2026-05-24T08:00:00.000Z' },
  ],
  contacts: [
    { id: 'contact_1', company_id: 'company_nusa', name: 'Maya Salim', email: 'maya@northwind.co', phone: '+62 812 1111 2222', type: 'lead', status: 'qualified', value: 54000 },
    { id: 'contact_2', company_id: 'company_atlas', name: 'Aditya Rahman', email: 'aditya@retailhub.id', phone: '+62 812 3333 4444', type: 'customer', status: 'active', value: 38000 },
    { id: 'contact_3', company_id: 'company_kinara', name: 'Clara Wijaya', email: 'clara@studioflow.io', phone: '+62 812 5555 6666', type: 'lead', status: 'proposal', value: 26000 },
  ],
  transactions: [
    { id: 'tx_1', company_id: 'company_nusa', description: 'Enterprise subscription', amount: 42000, type: 'income', category: 'Revenue', date: '2026-05-22' },
    { id: 'tx_2', company_id: 'company_atlas', description: 'Performance marketing', amount: 8500, type: 'expense', category: 'Marketing', date: '2026-05-21' },
    { id: 'tx_3', company_id: 'company_kinara', description: 'Design retainer', amount: 18000, type: 'income', category: 'Services', date: '2026-05-18' },
    { id: 'tx_4', company_id: 'company_nusa', description: 'Cloud infrastructure', amount: 5200, type: 'expense', category: 'Operations', date: '2026-05-16' },
  ],
};

function cloneSeedData() {
  return JSON.parse(JSON.stringify(seedData)) as FounderData;
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function createId(prefix: string) {
  const randomId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  return `${prefix}_${randomId}`;
}

export function readFounderData(): FounderData {
  if (!canUseStorage()) return cloneSeedData();

  const raw = window.localStorage.getItem(DATA_KEY);
  if (!raw) {
    const seeded = cloneSeedData();
    window.localStorage.setItem(DATA_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    return { ...cloneSeedData(), ...JSON.parse(raw) };
  } catch (error) {
    console.error('Failed to read FounderOS local data', error);
    const seeded = cloneSeedData();
    window.localStorage.setItem(DATA_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function writeFounderData(data: FounderData) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function updateFounderData(updater: (data: FounderData) => FounderData) {
  const nextData = updater(readFounderData());
  writeFounderData(nextData);
  return nextData;
}

export function readSession(): FounderSession | null {
  if (!canUseStorage()) return null;

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as FounderSession;
  } catch (error) {
    console.error('Failed to read FounderOS session', error);
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function writeSession(session: FounderSession) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function ensureSession() {
  const existingSession = readSession();
  if (existingSession) return existingSession;

  const defaultSession = {
    name: 'Demo Founder',
    email: 'founder@founderos.local',
    workspace: 'FounderOS Demo Workspace',
  };
  writeSession(defaultSession);
  return defaultSession;
}

export function getCompanyName(data: FounderData, companyId: string) {
  return data.companies.find((company) => company.id === companyId)?.name || 'Unassigned';
}

export function getCompanyProjectCount(data: FounderData, companyId: string) {
  return data.projects.filter((project) => project.company_id === companyId).length;
}

export function getProjectTaskCount(data: FounderData, projectId: string) {
  return data.tasks.filter((task) => task.project_id === projectId).length;
}

export function getCompanyPipelineValue(data: FounderData, companyId: string) {
  return data.contacts
    .filter((contact) => contact.company_id === companyId && contact.type === 'lead')
    .reduce((total, contact) => total + Number(contact.value || 0), 0);
}
