import React, { useState } from 'react';
import { Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function AIAdvisor() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResponse('');
    
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context: 'User is asking for business advice in FounderOS.' })
      });
      
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResponse(data.result);
    } catch (error) {
      console.error(error);
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">FounderOS AI Advisor</h2>
        <p className="text-slate-500 mt-2">Your strategic partner for growth, marketing, and operations.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto">
          {!response && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Bot className="w-12 h-12 mb-4 opacity-20" />
              <p>Ask me to generate a marketing strategy, analyze a deal, or draft a proposal.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-2xl">
                {['Draft a cold email for SaaS sales', 'Create a 30-day launch plan', 'Analyze my pricing strategy', 'Write a job description for a CTO'].map((suggestion) => (
                  <button 
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="p-4 text-left text-sm bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-100"
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
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Ask FounderOS AI..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-indigo-200"
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
