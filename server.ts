import express from "express";
import { createServer as createViteServer } from "vite";
import { initDatabase, db } from "./server/db";
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';

// Initialize DB
initDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Get Dashboard Data
  app.get("/api/dashboard", (req, res) => {
    try {
      // Mock user context for now
      const userId = 'user_1';
      
      const companies = db.prepare(`
        SELECT c.*, 
          (SELECT COUNT(*) FROM projects p WHERE p.company_id = c.id) as project_count,
          (SELECT COUNT(*) FROM contacts ct WHERE ct.company_id = c.id) as contact_count,
          (SELECT SUM(value) FROM contacts ct WHERE ct.company_id = c.id AND ct.type = 'lead') as pipeline_value
        FROM companies c 
        JOIN workspaces w ON c.workspace_id = w.id 
        WHERE w.owner_id = ?
      `).all(userId);

      const recentTasks = db.prepare(`
        SELECT t.*, p.name as project_name 
        FROM tasks t 
        JOIN projects p ON t.project_id = p.id
        JOIN companies c ON p.company_id = c.id
        JOIN workspaces w ON c.workspace_id = w.id
        WHERE w.owner_id = ?
        ORDER BY t.created_at DESC LIMIT 5
      `).all(userId);

      res.json({ companies, recentTasks });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Get Companies
  app.get("/api/companies", (req, res) => {
    try {
      const userId = 'user_1';
      const companies = db.prepare(`
        SELECT c.*, 
          (SELECT COUNT(*) FROM projects p WHERE p.company_id = c.id) as project_count
        FROM companies c 
        JOIN workspaces w ON c.workspace_id = w.id 
        WHERE w.owner_id = ?
      `).all(userId);
      res.json(companies);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Create Company
  app.post("/api/companies", (req, res) => {
    const { name, type, industry } = req.body;
    const userId = 'user_1';
    
    // Get workspace for user
    const workspace = db.prepare('SELECT id FROM workspaces WHERE owner_id = ?').get(userId) as { id: string };
    
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const id = uuidv4();
    try {
      db.prepare(`
        INSERT INTO companies (id, workspace_id, name, type, industry)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, workspace.id, name, type, industry);
      
      const newCompany = db.prepare(`
        SELECT c.*, 0 as project_count
        FROM companies c WHERE c.id = ?
      `).get(id);
      
      res.json(newCompany);
    } catch (error) {
      console.error("Failed to create company:", error);
      res.status(500).json({ error: "Failed to create company" });
    }
  });

  // Delete Company
  app.delete("/api/companies/:id", (req, res) => {
    const { id } = req.params;
    try {
      // Check if company exists and belongs to user (via workspace)
      // For simplicity in this demo, we just delete
      db.prepare('DELETE FROM companies WHERE id = ?').run(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete company:", error);
      res.status(500).json({ error: "Failed to delete company" });
    }
  });

  // Get Projects
  app.get("/api/projects", (req, res) => {
    try {
      const userId = 'user_1';
      const projects = db.prepare(`
        SELECT p.*, c.name as company_name,
          (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as task_count
        FROM projects p
        JOIN companies c ON p.company_id = c.id
        JOIN workspaces w ON c.workspace_id = w.id
        WHERE w.owner_id = ?
      `).all(userId);
      res.json(projects);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Get CRM Contacts
  app.get("/api/crm", (req, res) => {
    try {
      const userId = 'user_1';
      const contacts = db.prepare(`
        SELECT ct.*, c.name as company_name
        FROM contacts ct
        JOIN companies c ON ct.company_id = c.id
        JOIN workspaces w ON c.workspace_id = w.id
        WHERE w.owner_id = ?
      `).all(userId);
      res.json(contacts);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Get Finance Transactions
  app.get("/api/finance", (req, res) => {
    try {
      const userId = 'user_1';
      const transactions = db.prepare(`
        SELECT t.*, c.name as company_name
        FROM transactions t
        JOIN companies c ON t.company_id = c.id
        JOIN workspaces w ON c.workspace_id = w.id
        WHERE w.owner_id = ?
        ORDER BY t.date DESC
      `).all(userId);
      res.json(transactions);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // AI Assistant Endpoint
  app.post("/api/ai/generate", async (req, res) => {
    const { prompt, context } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API Key not configured" });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-2.5-flash"; // Using flash for speed

      const systemPrompt = `You are the FounderOS AI, a strategic business advisor. 
      Context: ${context || 'General business advice'}.
      Provide actionable, concise, and professional business advice.`;

      const response = await ai.models.generateContent({
        model: model,
        contents: [
          { role: "user", parts: [{ text: systemPrompt + "\n\nUser Query: " + prompt }] }
        ]
      });

      res.json({ result: response.text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const path = await import("path");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
