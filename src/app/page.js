"use client";

import { useState } from "react";
import StockForm from "@/components/StockForm";
import PredictionResult from "@/components/PredictionResult";

export default function Home() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrediction = async (symbol) => {
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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-xl text-center flex flex-col gap-8">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">
            AI Investment Oracle
          </h1>
          <p className="text-slate-400 text-lg">
            Harness the power of Machine Learning to predict stock market trends over multiple time horizons.
          </p>
        </div>

        <div className="glass-card p-8 text-left">
          <StockForm onSubmit={fetchPrediction} isLoading={isLoading} />
          
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}
        </div>
      </div>

      <div className="z-10 w-full">
        <PredictionResult result={result} />
      </div>

    </main>
  );
}
