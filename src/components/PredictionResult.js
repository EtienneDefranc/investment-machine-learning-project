"use client";

export default function PredictionResult({ result, isLoading, activeSymbol }) {
  if (isLoading) {
    return (
      <div className="glass-card p-8 animate-pulse w-full">
        <div className="h-8 bg-slate-800 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-800/50 rounded-2xl border border-white/5"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { symbol, data } = result;
  
  const getBadgeStyle = (direction) => {
    return direction === "UP" 
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]" 
      : "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]";
  };

  const getIcon = (direction) => {
    return direction === "UP" 
      ? <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
      : <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>;
  };

  const formatProb = (prob) => `${(prob * 100).toFixed(1)}%`;

  return (
    <div className="glass-card p-8 animate-fade-in w-full shadow-2xl relative overflow-hidden">
      
      {/* Background glow based on 5d prediction */}
      <div className={`absolute -top-32 -right-32 w-96 h-96 blur-[100px] rounded-full pointer-events-none opacity-20 ${data.classification_5d === 'UP' ? 'bg-emerald-500' : 'bg-red-500'}`} />

      <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">{symbol}</h2>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Model Evaluation
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-1">Current Price</p>
          <p className="text-3xl font-mono tracking-tight">${data.current_price.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* 1 Day Prediction (Regression) */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-500" />
          <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-2">Tomorrow's Price</p>
          <p className="text-4xl font-mono text-blue-400 tracking-tight">${data.prediction_1d_price.toFixed(2)}</p>
          <div className="mt-4 flex items-center text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-lg">
             <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             Random Forest Regressor
          </div>
        </div>

        {/* 5 Day Prediction (Classification) */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-center items-center text-center ${getBadgeStyle(data.classification_5d)}`}>
          <p className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-80">5-Day Outlook</p>
          <div className="flex items-center text-3xl font-extrabold tracking-tight mb-2">
            {getIcon(data.classification_5d)}
            {data.classification_5d}
          </div>
          <div className="w-full bg-black/20 rounded-full h-1.5 mt-4 mb-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${data.classification_5d === 'UP' ? 'bg-emerald-500' : 'bg-red-500'}`} 
              style={{ width: `${data.confidence_5d * 100}%` }}
            />
          </div>
          <p className="text-sm font-medium">Confidence: {formatProb(data.confidence_5d)}</p>
        </div>

        {/* 7 Day Prediction (Classification) */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-center items-center text-center ${getBadgeStyle(data.classification_7d)}`}>
          <p className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-80">7-Day Outlook</p>
          <div className="flex items-center text-3xl font-extrabold tracking-tight mb-2">
            {getIcon(data.classification_7d)}
            {data.classification_7d}
          </div>
          <div className="w-full bg-black/20 rounded-full h-1.5 mt-4 mb-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${data.classification_7d === 'UP' ? 'bg-emerald-500' : 'bg-red-500'}`} 
              style={{ width: `${data.confidence_7d * 100}%` }}
            />
          </div>
          <p className="text-sm font-medium">Confidence: {formatProb(data.confidence_7d)}</p>
        </div>

        {/* 30 Day Prediction (Classification) */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-center items-center text-center ${getBadgeStyle(data.classification_30d)}`}>
          <p className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-80">30-Day Outlook</p>
          <div className="flex items-center text-3xl font-extrabold tracking-tight mb-2">
            {getIcon(data.classification_30d)}
            {data.classification_30d}
          </div>
          <div className="w-full bg-black/20 rounded-full h-1.5 mt-4 mb-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${data.classification_30d === 'UP' ? 'bg-emerald-500' : 'bg-red-500'}`} 
              style={{ width: `${data.confidence_30d * 100}%` }}
            />
          </div>
          <p className="text-sm font-medium">Confidence: {formatProb(data.confidence_30d)}</p>
        </div>

      </div>
      
    </div>
  );
}
