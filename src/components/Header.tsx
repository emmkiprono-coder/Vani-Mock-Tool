import { PageKey } from "../App";
import { Bell, Search, RefreshCw, Calendar } from "lucide-react";

const pageTitles: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: { title: "Command Center", subtitle: "Real-time rebate & contract intelligence overview" },
  contracts: { title: "Contract Operations", subtitle: "GPO & vendor contract lifecycle management" },
  reconciliation: { title: "Rebate Reconciliation", subtitle: "Payment matching, variance analysis & dispute resolution" },
  analytics: { title: "Revenue Analytics", subtitle: "Regulatory & financial performance intelligence" },
  agents: { title: "AI Agent Hub", subtitle: "Autonomous agent orchestration & monitoring" },
  opportunities: { title: "Opportunity Finder", subtitle: "AI-detected contract optimization & revenue recovery" },
  qa: { title: "QA Review Center", subtitle: "Compliance validation, audit trail & exception management" },
};

export default function Header({ activePage }: { activePage: PageKey }) {
  const { title, subtitle } = pageTitles[activePage];
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  return (
    <header className="border-b border-[#1a2035] bg-[#0a0d14]/80 backdrop-blur px-6 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white tracking-widest uppercase">{title}</h1>
            <span className="text-[10px] px-2 py-0.5 bg-[#0066ff]/20 border border-[#0066ff]/30 rounded-full text-[#00d4ff] tracking-widest">VANI</span>
          </div>
          <p className="text-[11px] text-[#4a5568] mt-0.5 tracking-wide">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-[#4a5568]">
          <Calendar size={12} />
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-1 bg-[#1a2035] border border-[#2a3350] rounded-lg px-3 py-1.5">
          <Search size={12} className="text-[#4a5568]" />
          <input className="bg-transparent text-xs text-white placeholder-[#4a5568] outline-none w-40" placeholder="Search contracts, rebates..." />
        </div>
        <button className="p-2 text-[#4a5568] hover:text-[#00d4ff] transition-colors"><RefreshCw size={14} /></button>
        <button className="relative p-2 text-[#4a5568] hover:text-[#00d4ff] transition-colors">
          <Bell size={14} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff4d6d] rounded-full" />
        </button>
      </div>
    </header>
  );
}
