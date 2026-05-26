import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  CreditCard
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  company_name: string;
}

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinance = () => {
    setLoading(true);
    setError(null);
    fetch('/api/finance')
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setTransactions(data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Gagal memuat keuangan dari server');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  if (loading) return (
    <div className="p-12 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-indigo-250 border-t-indigo-600 rounded-full animate-spin" />
      <span className="text-slate-500 font-medium text-sm animate-pulse">Loading Finance...</span>
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
        <p className="text-rose-600 font-semibold mb-2">Gagal Memuat Keuangan</p>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button 
          onClick={fetchFinance} 
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Base chart data
  const baseChartData = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
    { name: 'Jul', income: 3490, expense: 4300 },
  ];

  // Calculate forecast based on historical average growth
  const generateForecast = (data: any[]) => {
    if (data.length < 2) return data;
    
    let incDelta = 0;
    let expDelta = 0;
    for (let i = 1; i < data.length; i++) {
        incDelta += data[i].income - data[i-1].income;
        expDelta += data[i].expense - data[i-1].expense;
    }
    // Smoothing the delta to avoid wild variance
    incDelta = (incDelta / (data.length - 1)) * 0.8 + 200; 
    expDelta = (expDelta / (data.length - 1)) * 0.5 + 100;

    const result = data.map((d, i) => {
        if (i === data.length - 1) {
            // Join point between historical and forecast
            return { ...d, forecastIncome: d.income, forecastExpense: d.expense };
        }
        return { ...d, forecastIncome: null, forecastExpense: null };
    });

    const last = data[data.length - 1];
    const nextMonths = ['Aug', 'Sep', 'Oct'];
    
    nextMonths.forEach((month, idx) => {
       result.push({
          name: month,
          income: null,
          expense: null,
          forecastIncome: Math.max(0, Math.round(last.income + (incDelta * (idx + 1)))),
          forecastExpense: Math.max(0, Math.round(last.expense + (expDelta * (idx + 1))))
       });
    });

    return result;
  };

  const chartData = generateForecast(baseChartData);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance</h1>
          <p className="text-slate-500 mt-1">Cashflow, P&L, and expense management.</p>
        </div>
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 font-medium">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900">${totalIncome.toLocaleString()}</h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +8.2%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Expenses</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900">${totalExpenses.toLocaleString()}</h3>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Net Profit</p>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ${netProfit.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-semibold text-slate-900">Cashflow & Forecast</h3>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Actual Income
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span> Actual Expense
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span> Forecast Income
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span> Forecast Expense
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorForecastIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorForecastExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
                <Area type="monotone" dataKey="forecastIncome" stroke="#6366f1" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecastIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey="forecastExpense" stroke="#f97316" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecastExpense)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                    {tx.type === 'income' ? 
                      <TrendingUp className="w-4 h-4 text-emerald-600" /> :
                      <CreditCard className="w-4 h-4 text-rose-600" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{tx.description}</p>
                    <p className="text-xs text-slate-500">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-slate-400 text-sm">No transactions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
