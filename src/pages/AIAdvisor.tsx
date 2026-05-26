import { useEffect, useState } from 'react';
import { Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AdvisorMessage {
  id: string;
  prompt: string;
  response: string;
  createdAt: string;
}

const HISTORY_KEY = 'founderos:ai-history:v1';

function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as AdvisorMessage[];
  } catch (error) {
    console.error('Failed to read AI history', error);
    return [];
  }
}

function createLocalAdvice(userPrompt: string) {
  return [
    `Rekomendasi untuk: ${userPrompt}`,
    '',
    '1. Klarifikasi outcome utama dan metrik keberhasilan sebelum tim mulai bergerak.',
    '2. Pecah pekerjaan menjadi 3 prioritas: revenue, operasi, dan risiko yang perlu ditutup minggu ini.',
    '3. Tetapkan owner, deadline, dan checkpoint singkat agar keputusan tidak berhenti di diskusi.',
    '4. Review hasilnya di dashboard FounderOS dan simpan follow-up sebagai project atau CRM action.',
  ].join('\n');
}

export default function AIAdvisor() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<AdvisorMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedHistory = readHistory();
    setHistory(storedHistory);
    setResponse(storedHistory[0]?.response || '');
  }, []);

  const saveHistory = (userPrompt: string, advisorResponse: string) => {
    const nextHistory = [
      {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()),
        prompt: userPrompt,
        response: advisorResponse,
        createdAt: new Date().toISOString(),
      },
      ...history,
    ].slice(0, 10);
    setHistory(nextHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResponse('');
    const userPrompt = prompt.trim();
    
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, context: 'User is asking for business advice in FounderOS.' })
      });
      
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResponse(data.result);
      saveHistory(userPrompt, data.result);
    } catch (error) {
      console.error(error);
      const fallback = createLocalAdvice(userPrompt);
      setResponse(fallback);
      saveHistory(userPrompt, fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-8rem)] max-w-4xl flex-col">
      <div className="mb-5 text-center md:mb-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 md:h-16 md:w-16">
          <Sparkles className="h-6 w-6 text-white md:h-8 md:w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">FounderOS AI Advisor</h2>
        <p className="text-wrap-safe mt-2 text-sm text-slate-500 md:text-base">Your strategic partner for growth, marketing, and operations.</p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {!response && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Bot className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-wrap-safe text-center text-sm md:text-base">Ask me to generate a marketing strategy, analyze a deal, or draft a proposal.</p>
              <div className="mt-6 grid w-full max-w-2xl grid-cols-2 gap-3 md:mt-8 md:gap-4">
                {['Draft a cold email for SaaS sales', 'Create a 30-day launch plan', 'Analyze my pricing strategy', 'Write a job description for a CTO'].map((suggestion) => (
                  <button 
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="text-wrap-safe rounded-xl border border-slate-100 bg-slate-50 p-3 text-left text-xs transition-colors hover:bg-slate-100 md:p-4 md:text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="text-sm text-slate-500 font-medium">Thinking...</span>
              </div>
            </div>
          )}

          {response && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-slate max-w-none"
            >
              <div className="whitespace-pre-wrap">{response}</div>
            </motion.div>
          )}

          {history.length > 0 && (
            <div className="mt-8 border-t border-slate-100 pt-5">
              <p className="mb-3 text-sm font-semibold text-slate-700">Recent advice</p>
              <div className="space-y-2">
                {history.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setPrompt(item.prompt);
                      setResponse(item.response);
                    }}
                    className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100"
                  >
                    {item.prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 bg-slate-50 p-3 md:p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Ask FounderOS AI..."
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 md:px-4 md:py-3"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-3"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
