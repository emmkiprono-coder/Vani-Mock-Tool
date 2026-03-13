import type { PageKey } from "../App";
import {
  LayoutDashboard, FileText, ArrowLeftRight, BarChart3,
  Bot, Lightbulb, ShieldCheck, ChevronLeft, ChevronRight,
  Zap
} from "lucide-react";

interface SidebarProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: { key: PageKey; label: string; icon: any; badge?: string }[] = [
  { key: "dashboard", label: "Command Center", icon: LayoutDashboard },
  { key: "contracts", label: "Contract Ops", icon: FileText, badge: "12" },
  { key: "reconciliation", label: "Reconciliation", icon: ArrowLeftRight, badge: "4" },
  { key: "analytics", label: "Revenue Analytics", icon: BarChart3 },
  { key: "agents", label: "Agent Hub", icon: Bot, badge: "Live" },
  { key: "opportunities", label: "Opportunity Finder", icon: Lightbulb, badge: "7" },
  { key: "qa", label: "QA Review", icon: ShieldCheck, badge: "3" },
];

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <div className={`flex flex-col bg-[#0d1117] border-r border-[#1a2035] transition-all duration-300 ${collapsed ? "w-16" : "w-64"} relative flex-shrink-0`}>
      <div className={`flex items-center gap-3 p-4 border-b border-[#1a2035] ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 bg-gradient-to-br from-[#00d4ff] to-[#0066ff] rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-xs font-bold text-white tracking-widest uppercase">Vani</div>
            <div className="text-[10px] text-[#4a5568] tracking-wider">Contract Intelligence</div>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="mx-3 mt-3 mb-1 px-3 py-2 bg-[#0a1628] border border-[#0066ff]/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
            <span className="text-[10px] text-[#00d4ff] tracking-widest">7 AGENTS ACTIVE</span>
          </div>
        </div>
      )}

      <nav className="flex-1 p-2 space-y-1 mt-2">
        {navItems.map(({ key, label, icon: Icon, badge }) => {
          const isActive = activePage === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative
                ${isActive
                  ? "bg-[#0066ff]/20 border border-[#0066ff]/40 text-white"
                  : "text-[#4a5568] hover:text-white hover:bg-[#1a2035] border border-transparent"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#00d4ff] rounded-r-full" />}
              <Icon size={18} className={isActive ? "text-[#00d4ff]" : "group-hover:text-[#00d4ff] transition-colors"} />
              {!collapsed && (
                <>
                  <span className="text-xs tracking-wide flex-1 text-left">{label}</span>
                  {badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full tracking-wider font-bold
                      ${badge === "Live" ? "bg-green-500/20 text-green-400 animate-pulse" : "bg-[#0066ff]/20 text-[#00d4ff]"}
                    `}>
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#1a2035] border border-[#2a3350] rounded-full flex items-center justify-center text-[#4a5568] hover:text-white transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div className={`p-3 border-t border-[#1a2035] flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00d4ff] flex items-center justify-center flex-shrink-0 text-[10px] font-bold">EC</div>
        {!collapsed && (
          <div>
            <div className="text-xs text-white">Emmanuel C.</div>
            <div className="text-[10px] text-[#4a5568]">AVP Language Services</div>
          </div>
        )}
      </div>
    </div>
  );
}
