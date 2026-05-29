"use client";

export default function StockCard({ symbol, name, icon, onClick, isLoading, isSelected, liveData }) {
  // Determine trend from live data if available
  const isUp = liveData?.trend_5d === "UP";
  const showLive = liveData != null;

  return (
    <button
      onClick={() => onClick(symbol)}
      disabled={isLoading}
      className={`relative overflow-hidden text-left p-5 rounded-2xl border transition-all duration-300 ease-out group min-h-[140px] flex flex-col justify-between
        ${isSelected 
          ? "bg-violet-500/20 border-violet-400/50 shadow-[0_0_30px_rgba(139,92,246,0.2)]" 
          : "glass-card hover:bg-slate-800/80 hover:border-slate-600/50 hover:-translate-y-1"
        }
        ${isLoading && !isSelected ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl shadow-inner border border-white/5">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight tracking-tight">{symbol}</h3>
            <p className="text-xs text-slate-400 font-medium truncate max-w-[100px]">{name}</p>
          </div>
        </div>
        
        {/* Top right pill */}
        {showLive ? (
          <div className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${isUp ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {isUp ? "UP ↗" : "DOWN ↘"}
          </div>
        ) : (
          <div className="w-12 h-6 bg-slate-700/50 animate-pulse rounded-md" />
        )}
      </div>

      {/* Bottom info area */}
      <div className="w-full flex justify-between items-end mt-4 relative z-10">
         {showLive ? (
            <p className="font-mono text-lg font-bold">${liveData.current_price.toFixed(2)}</p>
         ) : (
            <div className="w-20 h-6 bg-slate-700/50 animate-pulse rounded" />
         )}
      </div>

      {/* Decorative mini chart line based on trend */}
      {showLive && (
        <div className="absolute bottom-0 left-0 right-0 h-12 flex items-end gap-[2px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className={`w-full rounded-t-sm ${isUp ? "bg-emerald-500" : "bg-red-500"}`}
              style={{ 
                height: `${Math.max(10, (isUp ? i * 5 : 100 - (i * 5)) + Math.random() * 20)}%`,
                transition: "height 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
      
      {/* Loading overlay when specifically selected */}
      {isLoading && isSelected && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}
