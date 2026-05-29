"use client";

import { useState, useEffect } from "react";
import StockForm from "@/components/StockForm";
import PredictionResult from "@/components/PredictionResult";
import StockCard from "@/components/StockCard";

const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", icon: "🍎" },
  { symbol: "TSLA", name: "Tesla, Inc.", icon: "⚡" },
  { symbol: "NVDA", name: "NVIDIA Corp.", icon: "🎮" },
  { symbol: "MSFT", name: "Microsoft", icon: "🪟" },
];

export default function Home() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSymbol, setActiveSymbol] = useState(null);
  
  // Dashboard Live Data State
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    // Fetch live dashboard data automatically in the background
    const fetchDashboard = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${baseUrl}/api/dashboard`);
        const data = await response.json();
        
        if (response.ok && data.status === "success") {
          setDashboardData(data.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };
    
    fetchDashboard();
  }, []);

  const fetchPrediction = async (symbol) => {
    setActiveSymbol(symbol);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${baseUrl}/api/predict?symbol=${symbol}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch prediction");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 relative overflow-hidden bg-[#0A0C10]">
      
      {/* Premium Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <div className="z-10 w-full max-w-5xl mt-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Oracle<span className="text-violet-500">ML</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Institutional-grade AI Market Predictions</p>
        </div>
        <div className="w-full sm:w-auto flex-1 max-w-md">
          <StockForm onSubmit={fetchPrediction} isLoading={isLoading} />
        </div>
      </div>

      {/* Main Dashboard Area */}
      <div className="z-10 w-full max-w-5xl flex flex-col gap-10">
        
        {/* Error Banner */}
        {error && (
          <div className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 animate-fade-in flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{error}</span>
          </div>
        )}

        {/* Dashboard Grid & Results */}
        {!result && !isLoading && !error ? (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-6 text-slate-200">Live Watchlist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {POPULAR_STOCKS.map((stock) => (
                <StockCard 
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  icon={stock.icon}
                  liveData={dashboardData[stock.symbol]}
                  onClick={fetchPrediction}
                  isLoading={isLoading}
                  isSelected={activeSymbol === stock.symbol}
                />
              ))}
            </div>
            
            {/* Promo / Info area */}
            <div className="mt-12 glass-card p-8 text-center rounded-3xl border border-white/5 bg-gradient-to-b from-slate-900/50 to-slate-900/80">
              <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-violet-500/30">
                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Analyze any global equity</h3>
              <p className="text-slate-400 max-w-lg mx-auto">
                Our Random Forest models digest decades of historical pricing and technical indicators (MACD, RSI, Volatility) to forecast 1, 5, 7, and 30-day trends.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full animate-fade-in">
            {/* Quick switcher row when viewing a result */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {POPULAR_STOCKS.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => fetchPrediction(stock.symbol)}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg border whitespace-nowrap text-sm font-medium transition-colors
                    ${activeSymbol === stock.symbol 
                      ? "bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/20" 
                      : "bg-slate-800/50 text-slate-300 border-white/5 hover:bg-slate-700"
                    }`}
                >
                  {stock.symbol} 
                  {dashboardData[stock.symbol] && (
                    <span className={`ml-2 ${dashboardData[stock.symbol].trend_5d === "UP" ? "text-emerald-400" : "text-red-400"}`}>
                      {dashboardData[stock.symbol].trend_5d === "UP" ? "↗" : "↘"}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <PredictionResult result={result} isLoading={isLoading} activeSymbol={activeSymbol} />
          </div>
        )}
      </div>

    </main>
  );
}
