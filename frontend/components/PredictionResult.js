"use client";

export default function PredictionResult({ result }) {
  if (!result) return null;

  const { symbol, data } = result;
  
  const getBadgeColor = (direction) => {
    return direction === "UP" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30";
  };

  const getConfidenceText = (confidence) => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  return (
    <div className="glass-card p-6 mt-8 animate-fade-in w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
        <h2 className="text-3xl font-bold tracking-tight">{symbol}</h2>
        <div className="text-right">
          <p className="text-sm text-slate-400 uppercase tracking-wider">Current Price</p>
          <p className="text-2xl font-mono">${data.current_price.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1 Day Prediction (Regression) */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center">
          <p className="text-sm text-slate-400 mb-1">1 Day Forecast (Price)</p>
          <p className="text-2xl font-mono text-blue-400">${data.prediction_1d_price.toFixed(2)}</p>
          <p className="text-xs mt-2 text-slate-500">Based on Random Forest Regression</p>
        </div>

        {/* 5 Day Prediction (Classification) */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex flex-col justify-between items-center text-center">
          <p className="text-sm text-slate-400 mb-2">5 Day Trend</p>
          <span className={`px-4 py-1 rounded-full text-sm font-bold ${getBadgeColor(data.classification_5d)}`}>
            {data.classification_5d}
          </span>
          <p className="text-xs mt-3 text-slate-400">Confidence: {getConfidenceText(data.confidence_5d)}</p>
        </div>

        {/* 7 Day Prediction (Classification) */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex flex-col justify-between items-center text-center">
          <p className="text-sm text-slate-400 mb-2">7 Day Trend</p>
          <span className={`px-4 py-1 rounded-full text-sm font-bold ${getBadgeColor(data.classification_7d)}`}>
            {data.classification_7d}
          </span>
          <p className="text-xs mt-3 text-slate-400">Confidence: {getConfidenceText(data.confidence_7d)}</p>
        </div>

        {/* 30 Day Prediction (Classification) */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex flex-col justify-between items-center text-center">
          <p className="text-sm text-slate-400 mb-2">30 Day Trend</p>
          <span className={`px-4 py-1 rounded-full text-sm font-bold ${getBadgeColor(data.classification_30d)}`}>
            {data.classification_30d}
          </span>
          <p className="text-xs mt-3 text-slate-400">Confidence: {getConfidenceText(data.confidence_30d)}</p>
        </div>
      </div>
      
      <p className="text-xs text-center mt-6 text-slate-500">
        Disclaimer: This model is for educational purposes and should not be used as financial advice.
      </p>
    </div>
  );
}
