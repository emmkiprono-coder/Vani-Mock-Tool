import { useState, useEffect } from "react";
import { StatCard, AgentPulse, SectionHeader, Badge } from "../components/Shared";
import { PageKey } from "../App";
import {
  AlertTriangle, CheckCircle, Clock, DollarSign, TrendingUp,
  ArrowRight, Activity, Cpu, Wifi
} from "lucide-react";

interface DashboardProps {
  onNavigate: (page: PageKey) => void;
}

const agentStatuses = [
  { name: "ReconcileBot Alpha", status: "active" as const, task: "Matching Q1 2026 GPO rebate claims against 847 invoices — 94% matched", progress: 94 },
  { name: "ContractOptimizer", status: "processing" as const, task: "Analyzing tier thresholds across 23 active vendor agreements for uplift opportunities", progress: 67 },
  { name: "ComplianceWatcher", status: "active" as const, task: "Monitoring 340B eligibility and payer mix shifts — last check 2m ago", progress: 100 },
  { name: "DisputeResolver", status: "alert" as const, task: "3 unresolved variance exceptions exceed 30-day SLA — escalation required", progress: 30 },
  { name: "QA Sentinel", status: "active" as const, task: "Running automated audit on FY2025 rebate submissions — 218/240 reviewed", progress: 91 },
  { name: "RevenueHarvester", status: "processing" as const, task: "Scanning missed rebate triggers across 12 contract portfolios", progress: 55 },
  { name: "ForecastEngine", status: "idle" as const, task: "Scheduled: Q2 2026 rebate projection run at 02:00 EST", progress: 0 },
];

const recentActivity = [
  { type: "match", msg: "GPO Contract #AH-2024-0847 — $124,500 rebate payment MATCHED", time: "2m ago", status: "success" },
  { type: "alert", msg: "Variance detected: Medline Industries invoice $18,200 vs $21,400 expected", time: "8m ago", status: "warning" },
  { type: "opportunity", msg: "Tier upgrade opportunity: Cardinal Health — $2.1M spend gap to next tier", time: "15m ago", status: "info" },
  { type: "resolved", msg: "Dispute #DR-2026-0042 resolved: $34,800 credit applied", time: "31m ago", status: "success" },
  { type: "alert", msg: "SLA breach: Becton Dickinson Q4 rebate > 45 days outstanding", time: "1h ago", status: "danger" },
  { type: "qa", msg: "QA passed: 47 automated checks completed on Stryker contract renewal", time: "2h ago", status: "success" },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* System Status Bar */}
      <div className="flex items-center gap-4 bg-[#0d1117] border border-[#1a2035] rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Wifi size={12} className="text-green-400" />
          <span className="text-[10px] text-green-400 tracking-widest">SYSTEM ONLINE</span>
        </div>
        <div className="h-4 w-px bg-[#1a2035]" />
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-[#00d4ff]" />
          <span className="text-[10px] text-[#4a5568]">Live sync: <span className="text-[#00d4ff]">ERP / EDI / GPO Portal / Payer APIs</span></span>
        </div>
        <div className="h-4 w-px bg-[#1a2035]" />
        <div className="flex items-center gap-2">
          <Cpu size={12} className="text-[#f59e0b]" />
          <span className="text-[10px] text-[#4a5568]">7 agents running</span>
        </div>
        <div className="ml-auto text-[10px] text-[#4a5568] font-mono">
          {liveTime.toLocaleTimeString()} EST
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Rebates YTD" value="$8.47M" delta="+12.3% vs prior year" trend="up" sub="Across 84 active contracts" />
        <StatCard label="Pending Reconciliation" value="$1.24M" delta="4 batches open" trend="flat" accent="#f59e0b" sub="Est. close: 7 days" />
        <StatCard label="Unresolved Disputes" value="$312K" delta="-18% from last month" trend="down" accent="#ff4d6d" sub="11 open cases" />
        <StatCard label="Recovery Opportunities" value="$2.8M" delta="7 identified this week" trend="up" accent="#00ff88" sub="AI-detected upside" />
      </div>

      {/* Second KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Match Rate" value="97.3%" delta="+0.8% vs target" trend="up" accent="#00ff88" />
        <StatCard label="Avg Processing Time" value="4.2 days" delta="-1.1 days vs Q4" trend="down" accent="#00d4ff" />
        <StatCard label="GPO Compliance Score" value="98.4%" delta="Premier / Vizient / HPG" trend="flat" accent="#a78bfa" />
        <StatCard label="Contracts Expiring 90d" value="12" delta="Action required: 3 critical" trend="flat" accent="#f59e0b" />
      </div>

      {/* Agents + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status */}
        <div>
          <SectionHeader
            title="Agent Orchestra"
            action={
              <button onClick={() => onNavigate("agents")} className="flex items-center gap-1 text-[10px] text-[#00d4ff] hover:underline">
                Manage <ArrowRight size={10} />
              </button>
            }
          />
          <div className="space-y-2">
            {agentStatuses.map((a) => (
              <AgentPulse key={a.name} {...a} />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <SectionHeader title="Live Activity Feed" />
          <div className="space-y-2">
            {recentActivity.map((item, i) => (
              <div key={i} className="bg-[#0d1117] border border-[#1a2035] rounded-lg p-3 flex gap-3 hover:border-[#2a3350] transition-all">
                <div className="mt-0.5 flex-shrink-0">
                  {item.status === "success" && <CheckCircle size={14} className="text-green-400" />}
                  {item.status === "warning" && <AlertTriangle size={14} className="text-yellow-400" />}
                  {item.status === "danger" && <AlertTriangle size={14} className="text-[#ff4d6d]" />}
                  {item.status === "info" && <DollarSign size={14} className="text-[#00d4ff]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-white leading-relaxed">{item.msg}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={10} className="text-[#4a5568]" />
                    <span className="text-[10px] text-[#4a5568]">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Run Reconciliation", page: "reconciliation" as PageKey, icon: "⚡" },
            { label: "Review Opportunities", page: "opportunities" as PageKey, icon: "💡" },
            { label: "QA Dashboard", page: "qa" as PageKey, icon: "🛡️" },
            { label: "Contract Review", page: "contracts" as PageKey, icon: "📋" },
          ].map(({ label, page, icon }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-4 text-left hover:border-[#0066ff]/40 hover:bg-[#0a1628] transition-all group"
            >
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-xs text-white font-semibold">{label}</div>
              <div className="flex items-center gap-1 mt-1 text-[#4a5568] group-hover:text-[#00d4ff] transition-colors">
                <span className="text-[10px]">Launch</span>
                <ArrowRight size={10} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
