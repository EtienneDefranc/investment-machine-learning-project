"use client";

export default function StockCard({ symbol, name, icon, trend, onClick, isLoading, isSelected }) {
  return (
    <button
      onClick={() => onClick(symbol)}
      disabled={isLoading}
      className={`relative overflow-hidden text-left p-5 rounded-2xl border transition-all duration-300 ease-out group
        ${isSelected 
          ? "bg-violet-500/20 border-violet-400/50 shadow-[0_0_30px_rgba(139,92,246,0.2)]" 
          : "glass-card hover:bg-slate-800/80 hover:border-slate-600/50 hover:-translate-y-1"
        }
        ${isLoading && !isSelected ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl shadow-inner border border-white/5">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight tracking-tight">{symbol}</h3>
            <p className="text-xs text-slate-400 font-medium">{name}</p>
          </div>
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded-md ${trend > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
          {trend > 0 ? "+" : ""}{trend}%
        </div>
      </div>

      {/* Decorative mini chart line */}
      <div className="w-full h-8 flex items-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className={`w-full rounded-t-sm ${trend > 0 ? "bg-emerald-500/40" : "bg-red-500/40"}`}
            style={{ 
              height: `${Math.max(20, Math.random() * 100)}%`,
              transition: "height 0.3s ease",
            }}
          />
        ))}
      </div>
      
      {/* Loading overlay */}
      {isLoading && isSelected && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}
