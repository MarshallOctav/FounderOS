import { Database } from 'better-sqlite3';
import DatabaseConstructor from 'better-sqlite3';

let db: Database;

try {
  db = new DatabaseConstructor('founderos.db');
  db.pragma('journal_mode = WAL');
  console.log('Database initialized successfully');
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

export function initDatabase() {
  // Users & Auth
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Hierarchy: Workspace -> Holding Company -> Subsidiary
  db.exec(`
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      parent_company_id TEXT, -- If null, it's a holding company
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('holding', 'subsidiary', 'business_unit')) DEFAULT 'subsidiary',
      industry TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
      FOREIGN KEY (parent_company_id) REFERENCES companies(id)
    );
  `);

  // CRM Module
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      type TEXT CHECK(type IN ('lead', 'customer', 'partner')) DEFAULT 'lead',
      status TEXT DEFAULT 'new',
      value REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    );
  `);

  // Project Management Module
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      name TEXT NOT NULL,
      status TEXT DEFAULT 'planning',
      start_date DATETIME,
      end_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'todo',
      priority TEXT DEFAULT 'medium',
      assigned_to TEXT,
      due_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );
  `);

  // Finance Module
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
      category TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    );
  `);

  // AI Insights
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_insights (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      type TEXT NOT NULL, -- 'strategy', 'marketing', 'sales'
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    );
  `);

  // Seed Data (if empty)
  const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    console.log('Seeding database...');
    const userId = 'user_1';
    const workspaceId = 'ws_1';
    const holdingId = 'comp_1';
    const subId = 'comp_2';

    db.prepare('INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)').run(userId, 'demo@founderos.com', 'Demo Founder', 'hashed_secret');
    db.prepare('INSERT INTO workspaces (id, owner_id, name) VALUES (?, ?, ?)').run(workspaceId, userId, 'Empire Builder Workspace');
    db.prepare('INSERT INTO companies (id, workspace_id, name, type) VALUES (?, ?, ?, ?)').run(holdingId, workspaceId, 'Global Ventures Holdings', 'holding');
    db.prepare('INSERT INTO companies (id, workspace_id, parent_company_id, name, type) VALUES (?, ?, ?, ?, ?)').run(subId, workspaceId, holdingId, 'TechFlow SaaS', 'subsidiary');
    
    // Seed Projects
    db.prepare('INSERT INTO projects (id, company_id, name, status) VALUES (?, ?, ?, ?)').run('proj_1', subId, 'Q3 Marketing Push', 'active');
    db.prepare('INSERT INTO tasks (id, project_id, title, status) VALUES (?, ?, ?, ?)').run('task_1', 'proj_1', 'Launch Ad Campaign', 'in_progress');
    
    // Seed CRM
    db.prepare('INSERT INTO contacts (id, company_id, name, type, value) VALUES (?, ?, ?, ?, ?)').run('cont_1', subId, 'Acme Corp', 'lead', 50000);
    
    // Seed Finance
    db.prepare('INSERT INTO transactions (id, company_id, description, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?, ?)').run('tx_1', subId, 'Q3 SaaS Subscription', 15000, 'income', 'Sales', '2023-10-01');
    db.prepare('INSERT INTO transactions (id, company_id, description, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?, ?)').run('tx_2', subId, 'AWS Server Costs', 2500, 'expense', 'Infrastructure', '2023-10-05');
    db.prepare('INSERT INTO transactions (id, company_id, description, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?, ?)').run('tx_3', subId, 'Marketing Agency Retainer', 5000, 'expense', 'Marketing', '2023-10-10');
  }
}

export { db };
