import { useState } from "react";
import { SectionHeader } from "../components/Shared";
import { Play, Pause, Settings, RefreshCw, Terminal, Zap, AlertTriangle } from "lucide-react";

const agents = [
  {
    id: "AGENT-001",
    name: "ReconcileBot Alpha",
    role: "Reconciliation Engine",
    status: "active",
    model: "claude-sonnet-4-6",
    lastRun: "2m ago",
    tasksToday: 847,
    successRate: 99.2,
    currentTask: "Matching Cardinal Health Q1 rebate batch — 834/847 items processed",
    capabilities: ["Invoice matching", "Variance detection", "EDI parsing", "Dispute flagging"],
    triggers: ["New invoice batch", "Schedule 06:00 EST", "Manual"],
    logs: [
      { time: "09:14:32", msg: "Batch REC-2026-Q1-001 initiated — 847 items queued" },
      { time: "09:14:44", msg: "EDI X12 835 parsed successfully — 847 line items extracted" },
      { time: "09:15:01", msg: "834 items matched to contract AH-2024-0847 @ 3.0% tier" },
      { time: "09:15:02", msg: "13 items pending secondary match — routing to manual queue" },
    ],
  },
  {
    id: "AGENT-002",
    name: "ContractOptimizer",
    role: "Contract Intelligence",
    status: "processing",
    model: "claude-opus-4-6",
    lastRun: "15m ago",
    tasksToday: 23,
    successRate: 97.8,
    currentTask: "Analyzing spend thresholds across Stryker Corp — tier upgrade scenario modeling",
    capabilities: ["Tier modeling", "Spend gap analysis", "Rate benchmarking", "Renewal prep"],
    triggers: ["Weekly schedule", "Spend threshold alert", "Contract event"],
    logs: [
      { time: "08:58:10", msg: "Loaded 23 active contracts for optimization sweep" },
      { time: "09:00:22", msg: "Stryker: $780K additional spend → Tier 2 (4.5% → 5.5%) = +$7,800 rebate uplift" },
      { time: "09:02:15", msg: "Cardinal Health: Already optimal at current spend trajectory" },
    ],
  },
  {
    id: "AGENT-003",
    name: "ComplianceWatcher",
    role: "Regulatory Monitor",
    status: "active",
    model: "claude-sonnet-4-6",
    lastRun: "2m ago",
    tasksToday: 312,
    successRate: 100,
    currentTask: "340B eligibility monitoring — scanning 18 eligible facilities for payer mix changes",
    capabilities: ["340B eligibility", "Anti-kickback", "Stark Law", "Price transparency"],
    triggers: ["Real-time", "Payer mix change", "Regulatory update"],
    logs: [
      { time: "09:13:00", msg: "All 18 340B-eligible facilities validated — no diversion risk detected" },
      { time: "09:11:45", msg: "Payer mix shift detected: Advocate Lutheran — Medicare +3.2%, Medicaid -1.1%" },
    ],
  },
  {
    id: "AGENT-004",
    name: "DisputeResolver",
    role: "Exception Management",
    status: "alert",
    model: "claude-sonnet-4-6",
    lastRun: "5m ago",
    tasksToday: 11,
    successRate: 81.8,
    currentTask: "ESCALATION: 3 disputes exceed 30-day SLA — McKesson, Medline, BD pending",
    capabilities: ["Root cause analysis", "Vendor communication", "Credit memo processing", "SLA tracking"],
    triggers: ["Variance flagged", "SLA breach", "Manual escalation"],
    logs: [
      { time: "09:10:00", msg: "ALERT: DR-2026-0089 (McKesson $738K) — Day 52, SLA breach at Day 45" },
      { time: "09:10:01", msg: "Late payment penalty clause Section 8.3 triggered — $36,900 penalty" },
      { time: "09:10:15", msg: "Escalation notice drafted — awaiting user approval to send" },
    ],
  },
  {
    id: "AGENT-005",
    name: "QA Sentinel",
    role: "Quality Assurance",
    status: "active",
    model: "claude-sonnet-4-6",
    lastRun: "8m ago",
    tasksToday: 218,
    successRate: 98.6,
    currentTask: "Reviewing FY2025 rebate submissions for audit readiness — 218/240 complete",
    capabilities: ["Audit validation", "Data integrity", "Exception reporting", "Attestation prep"],
    triggers: ["Submission event", "Audit schedule", "Anomaly detected"],
    logs: [
      { time: "09:07:30", msg: "Stryker contract renewal QA — 47 checks passed, 0 failures" },
      { time: "09:05:15", msg: "Baxter Q1 submission: Tier calculation verified — $170K correct" },
    ],
  },
  {
    id: "AGENT-006",
    name: "RevenueHarvester",
    role: "Opportunity Discovery",
    status: "processing",
    model: "claude-opus-4-6",
    lastRun: "20m ago",
    tasksToday: 7,
    successRate: 100,
    currentTask: "Scanning missed rebate triggers — 12 portfolios, 5 opportunities identified",
    capabilities: ["Missed rebate detection", "Retroactive claims", "GPO participation gaps"],
    triggers: ["Weekly sweep", "New contract event", "Portfolio review"],
    logs: [
      { time: "08:45:00", msg: "Opportunity: Owens & Minor — retroactive Q4 rebate claim $24,500 available" },
      { time: "08:42:10", msg: "Gap found: BD Diagnostics not enrolled in Premier Tier 3 — forfeiting 0.5%" },
    ],
  },
  {
    id: "AGENT-007",
    name: "ForecastEngine",
    role: "Predictive Analytics",
    status: "idle",
    model: "claude-opus-4-6",
    lastRun: "6h ago",
    tasksToday: 1,
    successRate: 100,
    currentTask: "Scheduled: Q2 2026 rebate projection run at 02:00 EST tonight",
    capabilities: ["Revenue forecasting", "Spend modeling", "Tier projections", "Risk scoring"],
    triggers: ["Daily 02:00 EST", "Quarter-end", "Manual"],
    logs: [
      { time: "03:00:00", msg: "Q1 2026 forecast: $8.47M actual vs $8.2M projected — +$270K favorable" },
      { time: "02:00:00", msg: "Q2 2026 preliminary projection: $9.1M (confidence: 87%)" },
    ],
  },
];

const statusColors: Record<string, string> = {
  active: "#00d4ff",
  processing: "#f59e0b",
  idle: "#4a5568",
  alert: "#ff4d6d",
};

export default function AgentHub() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);

  return (
    <div className="grid grid-cols-3 gap-4 h-[calc(100vh-180px)]">
      {/* Agent List */}
      <div className="space-y-2 overflow-y-auto">
        <SectionHeader title="Agent Orchestra" />
        {agents.map(a => (
          <div
            key={a.id}
            onClick={() => setSelectedAgent(a)}
            className={`bg-[#0d1117] border rounded-xl p-3 cursor-pointer transition-all
              ${selectedAgent.id === a.id ? "border-[#0066ff]/40 bg-[#0a1628]" : "border-[#1a2035] hover:border-[#2a3350]"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-2 h-2 flex-shrink-0">
                <div className="absolute inset-0 rounded-full" style={{ backgroundColor: statusColors[a.status] }} />
                {(a.status === "active" || a.status === "processing") && (
                  <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: statusColors[a.status] }} />
                )}
              </div>
              <span className="text-xs font-bold text-white">{a.name}</span>
              {a.status === "alert" && <AlertTriangle size={11} className="text-[#ff4d6d] ml-auto" />}
            </div>
            <div className="text-[10px] text-[#4a5568] mb-1">{a.role}</div>
            <div className="text-[10px] text-[#c0c8d8] leading-relaxed line-clamp-2">{a.currentTask}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px]" style={{ color: statusColors[a.status] }}>{a.status.toUpperCase()}</span>
              <span className="text-[10px] text-[#4a5568]">{a.tasksToday} tasks today</span>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Detail */}
      <div className="col-span-2 space-y-4 overflow-y-auto">
        <div className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: statusColors[selectedAgent.status] }} />
                <h2 className="text-sm font-bold text-white">{selectedAgent.name}</h2>
              </div>
              <div className="text-[11px] text-[#4a5568] mt-0.5">{selectedAgent.role} · {selectedAgent.model}</div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0066ff] rounded-lg text-[11px] text-white hover:bg-[#0052cc] transition-colors">
                <Play size={11} /> Run Now
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2035] rounded-lg text-[11px] text-[#4a5568] hover:text-white transition-colors">
                <Settings size={11} /> Configure
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "Tasks Today", value: selectedAgent.tasksToday.toString() },
              { label: "Success Rate", value: `${selectedAgent.successRate}%` },
              { label: "Last Run", value: selectedAgent.lastRun },
              { label: "Status", value: selectedAgent.status.toUpperCase() },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#0a1628] border border-[#1a2035] rounded-lg p-2.5">
                <div className="text-[10px] text-[#4a5568] tracking-widest">{label}</div>
                <div className="text-sm font-bold text-white mt-0.5">{value}</div>
              </div>
            ))}
          </div>

          {/* Current Task */}
          <div className="bg-[#0a1628] border border-[#1a2035] rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={11} className="text-[#00d4ff]" />
              <span className="text-[10px] text-[#00d4ff] tracking-widest font-bold">CURRENT TASK</span>
            </div>
            <p className="text-[11px] text-white leading-relaxed">{selectedAgent.currentTask}</p>
          </div>

          {/* Capabilities + Triggers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-[#4a5568] tracking-widest uppercase mb-2">Capabilities</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedAgent.capabilities.map(c => (
                  <span key={c} className="px-2 py-1 bg-[#0066ff]/10 border border-[#0066ff]/20 rounded text-[10px] text-[#00d4ff]">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#4a5568] tracking-widest uppercase mb-2">Triggers</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedAgent.triggers.map(t => (
                  <span key={t} className="px-2 py-1 bg-[#1a2035] border border-[#2a3350] rounded text-[10px] text-[#4a5568]">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Agent Logs */}
        <div className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Terminal size={13} className="text-[#00d4ff]" />
              <span className="text-xs font-bold text-white tracking-widest">AGENT LOG</span>
            </div>
            <button className="flex items-center gap-1 text-[10px] text-[#4a5568] hover:text-white transition-colors">
              <RefreshCw size={10} /> Refresh
            </button>
          </div>
          <div className="bg-[#050810] border border-[#1a2035] rounded-lg p-3 font-mono space-y-1.5 max-h-48 overflow-y-auto">
            {selectedAgent.logs.map((log, i) => (
              <div key={i} className="flex gap-3 text-[11px]">
                <span className="text-[#4a5568] flex-shrink-0">{log.time}</span>
                <span className={`${log.msg.startsWith("ALERT") ? "text-[#ff4d6d]" : log.msg.startsWith("Opportunity") ? "text-[#00ff88]" : "text-[#c0c8d8]"}`}>
                  {log.msg}
                </span>
              </div>
            ))}
            <div className="flex gap-3 text-[11px]">
              <span className="text-[#4a5568]">——:——:——</span>
              <span className="text-[#00d4ff] animate-pulse">█</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
