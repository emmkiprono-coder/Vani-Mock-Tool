import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  accent?: string;
  sub?: string;
}

export function StatCard({ label, value, delta, trend, accent = "#00d4ff", sub }: StatCardProps) {
  return (
    <div className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-4 relative overflow-hidden group hover:border-[#2a3350] transition-all">
      <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10" style={{ background: accent }} />
      <div className="text-[10px] text-[#4a5568] tracking-widest uppercase mb-2">{label}</div>
      <div className="text-2xl font-bold text-white tracking-tight" style={{ color: accent === "#00d4ff" ? "white" : accent }}>{value}</div>
      {sub && <div className="text-[10px] text-[#4a5568] mt-0.5">{sub}</div>}
      {delta && (
        <div className={`flex items-center gap-1 mt-2 text-[11px] font-medium
          ${trend === "up" ? "text-green-400" : trend === "down" ? "text-[#ff4d6d]" : "text-[#4a5568]"}
        `}>
          {trend === "up" ? <TrendingUp size={12} /> : trend === "down" ? <TrendingDown size={12} /> : <Minus size={12} />}
          {delta}
        </div>
      )}
    </div>
  );
}

interface BadgeProps {
  label: string;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
}

const variantStyles = {
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  danger: "bg-[#ff4d6d]/10 text-[#ff4d6d] border-[#ff4d6d]/20",
  info: "bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/20",
  neutral: "bg-[#1a2035] text-[#4a5568] border-[#2a3350]",
};

export function Badge({ label, variant = "neutral" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${variantStyles[variant]}`}>
      {label}
    </span>
  );
}

interface AgentPulseProps {
  name: string;
  status: "active" | "processing" | "idle" | "alert";
  task: string;
  progress?: number;
}

const agentStatusColors = {
  active: "#00d4ff",
  processing: "#f59e0b",
  idle: "#4a5568",
  alert: "#ff4d6d",
};

export function AgentPulse({ name, status, task, progress }: AgentPulseProps) {
  const color = agentStatusColors[status];
  return (
    <div className="bg-[#0a1628] border border-[#1a2035] rounded-lg p-3 hover:border-[#2a3350] transition-all">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          {status === "active" || status === "processing" ? (
            <div className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ backgroundColor: color }} />
          ) : null}
        </div>
        <span className="text-[11px] text-white font-semibold">{name}</span>
        <span className="ml-auto text-[10px] tracking-widest uppercase" style={{ color }}>{status}</span>
      </div>
      <p className="text-[10px] text-[#4a5568] leading-relaxed">{task}</p>
      {progress !== undefined && (
        <div className="mt-2 h-1 bg-[#1a2035] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: color }}
          />
        </div>
      )}
    </div>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xs font-bold text-white tracking-widest uppercase border-l-2 border-[#00d4ff] pl-3">{title}</h2>
      {action}
    </div>
  );
}
