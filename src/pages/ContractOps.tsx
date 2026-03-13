import { useState } from "react";
import { Search, Plus, Filter, FileText, Calendar, DollarSign, AlertCircle, X, Check, Loader, ArrowRight, Download, Mail, RefreshCw, Eye } from "lucide-react";

const contracts = [
  { id: "AH-2024-0847", vendor: "Cardinal Health", type: "GPO Distributor", gpo: "Premier", tier: "Tier 2", spend: 4200000, rebate: 126000, rate: 3.0, status: "active", expiry: "2026-09-30", compliance: 99, contact: "Sarah Mitchell, VP Finance", nextReview: "Jun 2026" },
  { id: "AH-2024-0312", vendor: "Medline Industries", type: "Med-Surg Supply", gpo: "Vizient", tier: "Tier 3", spend: 2800000, rebate: 98000, rate: 3.5, status: "active", expiry: "2026-06-30", compliance: 97, contact: "Tom Hendricks, Account Mgr", nextReview: "Apr 2026" },
  { id: "AH-2025-0101", vendor: "Stryker Corp", type: "Orthopedic Implants", gpo: "HPG", tier: "Tier 1", spend: 7100000, rebate: 355000, rate: 5.0, status: "renewal", expiry: "2026-03-31", compliance: 94, contact: "Lisa Park, Director Sales", nextReview: "OVERDUE" },
  { id: "AH-2024-0589", vendor: "Becton Dickinson", type: "Lab & Diagnostics", gpo: "Premier", tier: "Tier 2", spend: 1600000, rebate: 44800, rate: 2.8, status: "dispute", expiry: "2026-12-31", compliance: 82, contact: "Mark Davis, AR Manager", nextReview: "Mar 2026" },
  { id: "AH-2025-0204", vendor: "Baxter International", type: "IV Solutions", gpo: "Vizient", tier: "Tier 4", spend: 3400000, rebate: 170000, rate: 5.0, status: "active", expiry: "2027-01-15", compliance: 100, contact: "Janet Wu, Key Account", nextReview: "Jan 2027" },
  { id: "AH-2024-0721", vendor: "Johnson & Johnson", type: "Surgical Instruments", gpo: "HPG", tier: "Tier 3", spend: 5800000, rebate: 261000, rate: 4.5, status: "active", expiry: "2026-08-31", compliance: 96, contact: "Robert Patel, Sr. Director", nextReview: "Jun 2026" },
  { id: "AH-2025-0033", vendor: "McKesson Corp", type: "Pharma Distribution", gpo: "Premier", tier: "Tier 1", spend: 12300000, rebate: 738000, rate: 6.0, status: "active", expiry: "2027-03-31", compliance: 99, contact: "Chris Lawson, VP Finance", nextReview: "Jan 2027" },
  { id: "AH-2024-0445", vendor: "Owens & Minor", type: "PPE & Disposables", gpo: "Vizient", tier: "Tier 2", spend: 980000, rebate: 24500, rate: 2.5, status: "expiring", expiry: "2026-04-15", compliance: 91, contact: "Amy Torres, Account Mgr", nextReview: "URGENT" },
];

const statusMeta: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: "Active", bg: "bg-green-500/10", text: "text-green-400" },
  renewal: { label: "Renewal Due", bg: "bg-yellow-500/10", text: "text-yellow-400" },
  dispute: { label: "In Dispute", bg: "bg-[#ff4d6d]/10", text: "text-[#ff4d6d]" },
  expiring: { label: "Expiring Soon", bg: "bg-orange-500/10", text: "text-orange-400" },
};

function ContractModal({ contract: c, onClose }: { contract: typeof contracts[0]; onClose: () => void }) {
  const [tab, setTab] = useState<"detail" | "ai" | "actions">("detail");
  const [actionDone, setActionDone] = useState<string[]>([]);
  const [actionRunning, setActionRunning] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const runAction = (label: string, msg: string) => {
    setActionRunning(label);
    setTimeout(() => { setActionRunning(null); setActionDone(d => [...d, label]); setToast(msg); setTimeout(() => setToast(null), 3000); }, 2000);
  };

  const actions = c.status === "renewal" ? [
    { label: "Send Renewal Proposal", icon: Mail, toast: "Renewal proposal sent to Stryker Corp. Estimated response: 5-7 business days." },
    { label: "Run AI Contract Analysis", icon: RefreshCw, toast: "AI analysis complete — recommended rate: 5.5% based on market benchmark." },
    { label: "Schedule Renewal Meeting", icon: Calendar, toast: "Meeting request sent to Lisa Park. Calendar invite for March 20, 2026." },
    { label: "Download Current Contract", icon: Download, toast: "Contract AH-2025-0101 PDF downloaded." },
  ] : c.status === "dispute" ? [
    { label: "Escalate to Legal", icon: AlertCircle, toast: "Dispute escalated to Advocate Health Legal team — Case #LGL-2026-0022." },
    { label: "Request Mediation via GPO", icon: Mail, toast: "Premier GPO mediation requested — ref #GPO-2026-0038." },
    { label: "Pull Price History", icon: FileText, toast: "Price variance report generated — 14 discrepancies over $500 identified." },
  ] : c.status === "expiring" ? [
    { label: "Start Renewal Workflow", icon: ArrowRight, toast: "Renewal workflow initiated for Owens & Minor. Deadline: April 1." },
    { label: "Request Extension", icon: Mail, toast: "30-day extension request sent to Owens & Minor." },
  ] : [
    { label: "Run Performance Report", icon: FileText, toast: "Performance report generated — all KPIs within threshold." },
    { label: "Schedule Quarterly Review", icon: Calendar, toast: "QBR scheduled with vendor contact for next month." },
    { label: "Download Contract PDF", icon: Download, toast: `Contract ${c.id} PDF downloaded.` },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4" onClick={onClose}>
      {toast && (
        <div className="fixed bottom-6 right-6 z-[70] flex items-center gap-3 bg-[#0d1117] border border-green-500/40 rounded-xl px-4 py-3">
          <Check size={14} className="text-green-400" />
          <span className="text-xs text-white max-w-xs">{toast}</span>
        </div>
      )}
      <div className="bg-[#0d1117] border border-[#2a3350] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#1a2035] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2"><span className="text-sm font-bold text-white">{c.vendor}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusMeta[c.status].bg} ${statusMeta[c.status].text} font-bold`}>{statusMeta[c.status].label}</span>
            </div>
            <div className="text-[11px] text-[#4a5568] mt-0.5">{c.id} · {c.gpo} · {c.type}</div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#4a5568] hover:text-white rounded hover:bg-[#1a2035] transition-colors"><X size={14} /></button>
        </div>

        <div className="flex border-b border-[#1a2035] px-5 flex-shrink-0">
          {(["detail", "ai", "actions"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[11px] tracking-widest uppercase relative transition-colors ${tab === t ? "text-[#00d4ff]" : "text-[#4a5568] hover:text-white"}`}>
              {t === "ai" ? "AI Insights" : t.charAt(0).toUpperCase() + t.slice(1)}
              {tab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d4ff]" />}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "detail" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { k: "Annual Spend", v: `$${(c.spend / 1000000).toFixed(1)}M` },
                  { k: "Rebate Earned YTD", v: `$${c.rebate.toLocaleString()}` },
                  { k: "Rebate Rate", v: `${c.rate}%` },
                  { k: "Tier", v: c.tier },
                  { k: "Expiration", v: c.expiry },
                  { k: "Compliance", v: `${c.compliance}%` },
                  { k: "Vendor Contact", v: c.contact },
                  { k: "Next Review", v: c.nextReview },
                  { k: "GPO", v: c.gpo },
                ].map(({ k, v }) => (
                  <div key={k} className="bg-[#0a1628] border border-[#1a2035] rounded-lg p-3">
                    <div className="text-[10px] text-[#4a5568] tracking-widest uppercase">{k}</div>
                    <div className={`text-xs font-bold mt-1 ${v === "OVERDUE" || v === "URGENT" ? "text-[#ff4d6d]" : "text-white"}`}>{v}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setTab("actions")} className="w-full py-2.5 bg-[#0066ff] rounded-lg text-xs text-white hover:bg-[#0052cc] transition-colors font-semibold">
                Take Action on This Contract
              </button>
            </div>
          )}
          {tab === "ai" && (
            <div className="space-y-3">
              <div className="bg-[#0a1628] border border-[#0066ff]/20 rounded-lg p-4">
                <div className="text-[10px] text-[#00d4ff] font-bold tracking-widest mb-2">VANI AI ANALYSIS</div>
                <p className="text-[11px] text-[#c0c8d8] leading-relaxed">
                  {c.status === "renewal" && `Contract AH-2025-0101 is overdue for renewal. Current rate of 5.0% is 0.5% below market average for orthopedic implant contracts at comparable spend levels. Recommend negotiating to 5.5% at renewal — estimated uplift: $35,500/yr. Stryker's recent Q4 results show 8% revenue growth, improving our leverage.`}
                  {c.status === "dispute" && `Becton Dickinson compliance at 82% is the lowest in the portfolio. Root cause: 3 SKUs priced at list rate instead of contracted rate. Pattern matches a known EDI mapping error in BD's billing system (reported by 4 other Premier members). Recommend requesting systematic correction and backdated credit.`}
                  {c.status === "active" && `Contract ${c.id} is performing well. Spend trajectory projects ${c.tier === "Tier 1" ? "no tier change" : "potential Tier 1 eligibility"} by year end. Recommend quarterly check-in with ${c.contact.split(",")[0]} to maintain relationship and monitor spend.`}
                  {c.status === "expiring" && `Owens & Minor contract expires in 34 days. Current rate of 2.5% is below the 2.8% Vizient benchmark for PPE. Renewal is an opportunity to renegotiate to market rate — estimated value: $2,940 incremental annually. Prioritize: HIGH.`}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Risk Score", value: c.compliance >= 95 ? "Low" : c.compliance >= 85 ? "Medium" : "High", color: c.compliance >= 95 ? "text-green-400" : c.compliance >= 85 ? "text-yellow-400" : "text-[#ff4d6d]" },
                  { label: "Optimization Score", value: c.tier === "Tier 1" ? "9.2 / 10" : "7.4 / 10", color: "text-[#00d4ff]" },
                  { label: "Market Rate", value: `${(c.rate + 0.3).toFixed(1)}%`, color: "text-green-400" },
                  { label: "Uplift Potential", value: `$${Math.round(c.spend * 0.003).toLocaleString()}`, color: "text-[#a78bfa]" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-[#0a1628] border border-[#1a2035] rounded-lg p-3">
                    <div className="text-[10px] text-[#4a5568] tracking-widest uppercase">{label}</div>
                    <div className={`text-sm font-bold mt-1 ${color}`}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "actions" && (
            <div className="space-y-3">
              <p className="text-[11px] text-[#4a5568] mb-3">Vani-recommended actions for {c.vendor}. All actions are logged for audit trail.</p>
              {actions.map(({ label, icon: Icon, toast: t }) => {
                const done = actionDone.includes(label);
                const running = actionRunning === label;
                return (
                  <button key={label} onClick={() => !done && !running && runAction(label, t)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all
                      ${done ? "bg-green-500/10 border-green-500/20 text-green-400 cursor-default"
                        : running ? "bg-[#0066ff]/10 border-[#0066ff]/30 text-[#00d4ff]"
                          : "bg-[#0a1628] border-[#1a2035] text-white hover:border-[#0066ff]/40"}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? "bg-green-500/20" : running ? "bg-[#0066ff]/20" : "bg-[#1a2035]"}`}>
                      {done ? <Check size={15} className="text-green-400" /> : running ? <Loader size={15} className="animate-spin text-[#00d4ff]" /> : <Icon size={15} className="text-[#00d4ff]" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold">{label}</div>
                      <div className="text-[10px] mt-0.5 text-[#4a5568]">{done ? "✓ Completed" : running ? "Executing via Vani..." : "Click to execute"}</div>
                    </div>
                    {!done && !running && <ArrowRight size={12} className="text-[#4a5568]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContractOps() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof contracts[0] | null>(null);

  const filtered = contracts.filter(c =>
    c.vendor.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {selected && <ContractModal contract={selected} onClose={() => setSelected(null)} />}
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Contracts", value: "84", icon: FileText, color: "#00d4ff" },
            { label: "Expiring 90 Days", value: "12", icon: Calendar, color: "#f59e0b" },
            { label: "Total Contract Value", value: "$48.2M", icon: DollarSign, color: "#00ff88" },
            { label: "In Dispute", value: "3", icon: AlertCircle, color: "#ff4d6d" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><Icon size={14} style={{ color }} /><span className="text-[10px] text-[#4a5568] tracking-widest uppercase">{label}</span></div>
              <div className="text-2xl font-bold text-white">{value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-[#0d1117] border border-[#1a2035] rounded-lg px-3 py-2">
            <Search size={12} className="text-[#4a5568]" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-xs text-white placeholder-[#4a5568] outline-none flex-1" placeholder="Search contracts..." />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-[#0066ff] rounded-lg text-[11px] text-white hover:bg-[#0052cc] transition-colors">
            <Plus size={12} /> New Contract
          </button>
          <div className="text-[10px] text-[#4a5568]">Click any row to drill down</div>
        </div>

        <div className="bg-[#0d1117] border border-[#1a2035] rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-[#1a2035]">
              {["Contract ID", "Vendor", "GPO", "Tier", "Spend", "Rebate", "Rate", "Compliance", "Status", "Expiry", ""].map(h => (
                <th key={h} className="text-left px-3 py-2.5 text-[10px] text-[#4a5568] tracking-widest uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((c) => {
                const sm = statusMeta[c.status];
                return (
                  <tr key={c.id} onClick={() => setSelected(c)} className="border-b border-[#1a2035]/50 hover:bg-[#0a1628] transition-colors cursor-pointer group">
                    <td className="px-3 py-2.5 text-[#00d4ff] font-mono text-[10px]">{c.id}</td>
                    <td className="px-3 py-2.5 text-white font-semibold">{c.vendor}</td>
                    <td className="px-3 py-2.5 text-[#4a5568]">{c.gpo}</td>
                    <td className="px-3 py-2.5 text-[#a78bfa]">{c.tier}</td>
                    <td className="px-3 py-2.5 text-white">${(c.spend / 1000000).toFixed(1)}M</td>
                    <td className="px-3 py-2.5 text-green-400 font-semibold">${(c.rebate / 1000).toFixed(0)}K</td>
                    <td className="px-3 py-2.5 text-[#00d4ff]">{c.rate}%</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1 w-12 bg-[#1a2035] rounded-full">
                          <div className={`h-full rounded-full ${c.compliance >= 95 ? "bg-green-400" : c.compliance >= 85 ? "bg-yellow-400" : "bg-[#ff4d6d]"}`} style={{ width: `${c.compliance}%` }} />
                        </div>
                        <span className="text-[10px] text-[#4a5568]">{c.compliance}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${sm.bg} ${sm.text}`}>{sm.label}</span></td>
                    <td className="px-3 py-2.5 text-[#4a5568] font-mono text-[10px]">{c.expiry}</td>
                    <td className="px-3 py-2.5">
                      <button className="flex items-center gap-1 px-2.5 py-1 bg-[#0066ff]/10 border border-[#0066ff]/20 rounded text-[10px] text-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye size={10} /> Open
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
