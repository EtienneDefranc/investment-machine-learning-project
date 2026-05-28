"use client";

import { useState } from 'react';

export default function StockForm({ onSubmit, isLoading }) {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSubmit(symbol.toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fade-in">
      <div>
        <label htmlFor="symbol" className="block text-sm font-medium mb-2 text-slate-300">
          Stock Ticker Symbol
        </label>
        <input
          type="text"
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="e.g. AAPL, MSFT, IBM"
          className="input-field"
          required
          disabled={isLoading}
        />
      </div>
      <button 
        type="submit" 
        className="btn-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing Patterns...' : 'Get AI Prediction'}
      </button>
    </form>
  );
}
