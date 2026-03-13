import { useState } from "react";
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle, Eye, Download, X, Check, Loader, ArrowRight, FileText, Mail, Users } from "lucide-react";

const qaItems = [
  { id: "QA-2026-0847", contract: "McKesson Corp", type: "Rebate Submission", check: "Amount Verification", status: "fail", severity: "critical",
    finding: "Submitted $738K rebate has no corresponding remittance from vendor. EDI 835 record absent from portal. Possible system error or withheld payment.",
    recommendation: "Initiate formal dispute. Cross-reference McKesson's own remittance portal. Engage Premier GPO for mediation if unresolved within 5 days.",
    reviewer: "Vani / ReconcileBot Alpha", date: "Today",
    actions: [
      { label: "Open QA Escalation Case", icon: FileText, toast: "QA escalation case QES-2026-0847 opened. Assigned to SVP Fernando compliance team." },
      { label: "Notify External Audit Team", icon: Mail, toast: "External audit team (Deloitte) notified of potential payment withholding. Ref #AUD-2026-0012." },
      { label: "Flag for Joint Commission Review", icon: ShieldCheck, toast: "Flagged for JC compliance file — will be included in next NPG Goal 7 review." },
    ]
  },
  { id: "QA-2026-0312", contract: "Baxter International", type: "Tier Calculation", check: "Rate Accuracy", status: "pass", severity: null,
    finding: "Tier 4 rate of 5.0% correctly applied to $170K payment. All three calculation scenarios validated against contract AH-2025-0204 Section 4.2.",
    recommendation: "No action required. Documentation archived for audit package.",
    reviewer: "Vani / QA Sentinel", date: "Today",
    actions: [
      { label: "Archive to Audit Package", icon: Download, toast: "QA-2026-0312 archived to FY2026 audit package folder." },
    ]
  },
  { id: "QA-2026-0287", contract: "Stryker Corp", type: "Contract Renewal", check: "Terms Compliance", status: "warning", severity: "medium",
    finding: "Renewal draft missing force majeure clause per updated 2026 Premier GPO template v3.2. Legal review flagged two additional gaps in indemnification language.",
    recommendation: "Return to Stryker for revision. Use GPO template v3.2 as baseline. Target resubmission within 10 days to avoid renewal delay.",
    reviewer: "Vani / QA Sentinel", date: "Yesterday",
    actions: [
      { label: "Return Contract for Revision", icon: FileText, toast: "Stryker renewal draft returned with tracked changes. 3 gaps flagged for Legal revision." },
      { label: "Assign to Legal Counsel", icon: Users, toast: "Assigned to Advocate Health Legal — Sarah Kim, Sr. Contracts Attorney. Due: March 20." },
      { label: "Set Revision Deadline", icon: Check, toast: "Deadline set: March 20, 2026. Reminder sent to Stryker VP Lisa Park." },
    ]
  },
  { id: "QA-2026-0265", contract: "Cardinal Health", type: "Audit Prep", check: "Documentation Completeness", status: "pass", severity: null,
    finding: "All 847 invoice-to-contract line items have supporting documentation. Tier calculation, rebate rate, and payment timeline all verified. Audit-ready.",
    recommendation: "Include in Q1 2026 audit package. No corrective action needed.",
    reviewer: "Vani / QA Sentinel", date: "Yesterday",
    actions: [
      { label: "Include in Audit Package", icon: Download, toast: "Cardinal Health documentation included in Q1 2026 audit package — audit-ready." },
    ]
  },
  { id: "QA-2026-0244", contract: "Medline Industries", type: "Dispute Review", check: "Variance Root Cause", status: "warning", severity: "high",
    finding: "Variance of $18,200 traced to incorrect SKU mapping in Medline EDI 835 submission. SKUs ML-WND-032 and ML-TRP-019 mapped to wrong contract tier. Pattern matches Medline system error reported Q3 2025.",
    recommendation: "Request corrected EDI submission from Medline. Escalate to Vizient if not resolved within 14 days. Cross-reference other Vizient members experiencing same issue.",
    reviewer: "Vani / DisputeResolver", date: "2 days ago",
    actions: [
      { label: "Send EDI Correction Request", icon: Mail, toast: "EDI correction request sent to Medline AR coordinator — ref #EDI-2026-0088." },
      { label: "Escalate to Vizient GPO", icon: ArrowRight, toast: "Vizient GPO notified of systematic EDI error. Mediation ref: VIZ-2026-0031." },
      { label: "File Pattern Report", icon: FileText, toast: "Pattern report filed — 3 similar Medline EDI errors recorded in QA system." },
    ]
  },
  { id: "QA-2026-0231", contract: "Johnson & Johnson", type: "Compliance Check", check: "340B Eligibility", status: "pass", severity: null,
    finding: "All J&J surgical items procured through 340B-eligible facilities. No diversion detected across 14 facility audits. HRSA-compliant documentation confirmed.",
    recommendation: "No action required. 340B compliance confirmed for Q1 2026.",
    reviewer: "Vani / ComplianceWatcher", date: "2 days ago",
    actions: [
      { label: "Log 340B Compliance Record", icon: ShieldCheck, toast: "340B compliance record logged — J&J Q1 2026. Filed in HRSA compliance folder." },
    ]
  },
  { id: "QA-2026-0218", contract: "Becton Dickinson", type: "Pricing Validation", check: "Contract Price Accuracy", status: "fail", severity: "high",
    finding: "3 line items invoiced at list price instead of contracted price: BD-NDL-440 ($0.15 vs $0.12), BD-SYR-660 ($0.28 vs $0.22), BD-CAT-110 ($2.10 vs $1.85). Overcharge: $2,340.",
    recommendation: "Request credit memo for $2,340. Flag BD billing system for audit — this is the third pricing error in 6 months. Consider placing BD on enhanced monitoring.",
    reviewer: "Vani / ReconcileBot Alpha", date: "3 days ago",
    actions: [
      { label: "Request Credit Memo $2,340", icon: FileText, toast: "Credit memo request sent to BD AR team. Expected within 10 business days." },
      { label: "Place BD on Enhanced Monitoring", icon: ShieldCheck, toast: "Becton Dickinson flagged for enhanced price monitoring — weekly auto-checks enabled." },
      { label: "Submit Vendor Scorecard Update", icon: Check, toast: "BD vendor scorecard updated — pricing accuracy noted. Shared with Procurement." },
    ]
  },
];

const severityColors: Record<string, string> = { critical: "#ff4d6d", high: "#f59e0b", medium: "#00d4ff" };

const auditChecklist = [
  { category: "Contract Terms", items: 24, passed: 24 },
  { category: "Rebate Calculations", items: 847, passed: 834 },
  { category: "GPO Compliance", items: 84, passed: 82 },
  { category: "Payment Documentation", items: 156, passed: 156 },
  { category: "Vendor Attestations", items: 12, passed: 9 },
  { category: "340B Eligibility", items: 18, passed: 18 },
  { category: "Regulatory Filings", items: 6, passed: 5 },
];

function QAModal({ item, onClose }: { item: typeof qaItems[0]; onClose: () => void }) {
  const [actionDone, setActionDone] = useState<string[]>([]);
  const [actionRunning, setActionRunning] = useState<string | null>(null);
  const [localToast, setLocalToast] = useState<string | null>(null);

  const runAction = (label: string, toast: string) => {
    setActionRunning(label);
    setTimeout(() => { setActionRunning(null); setActionDone(d => [...d, label]); setLocalToast(toast); setTimeout(() => setLocalToast(null), 3000); }, 2000);
  };

  const statusIcon = item.status === "pass" ? <CheckCircle size={14} className="text-green-400" /> :
    item.status === "fail" ? <XCircle size={14} className="text-[#ff4d6d]" /> :
      <AlertTriangle size={14} className="text-yellow-400" />;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4" onClick={onClose}>
      {localToast && (
        <div className="fixed bottom-6 right-6 z-[70] flex items-center gap-3 bg-[#0d1117] border border-green-500/40 rounded-xl px-4 py-3">
          <Check size={14} className="text-green-400" /><span className="text-xs text-white max-w-xs">{localToast}</span>
        </div>
      )}
      <div className="bg-[#0d1117] border border-[#2a3350] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#1a2035] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">{statusIcon}<span className="text-sm font-bold text-white">{item.contract}</span>
              {item.severity && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ color: severityColors[item.severity], borderColor: severityColors[item.severity] + "40", background: severityColors[item.severity] + "10" }}>{item.severity.toUpperCase()}</span>}
            </div>
            <div className="text-[11px] text-[#4a5568]">{item.id} · {item.type} · {item.check}</div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#4a5568] hover:text-white rounded hover:bg-[#1a2035] transition-colors"><X size={14} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className={`rounded-lg p-4 border ${item.status === "pass" ? "bg-green-500/5 border-green-500/20" : item.status === "fail" ? "bg-[#ff4d6d]/5 border-[#ff4d6d]/20" : "bg-yellow-500/5 border-yellow-500/20"}`}>
            <div className="text-[10px] font-bold tracking-widest mb-2 flex items-center gap-1.5">
              {statusIcon}
              <span className={item.status === "pass" ? "text-green-400" : item.status === "fail" ? "text-[#ff4d6d]" : "text-yellow-400"}>FINDING</span>
            </div>
            <p className="text-[11px] text-[#c0c8d8] leading-relaxed">{item.finding}</p>
          </div>
          <div className="bg-[#0a1628] border border-[#0066ff]/20 rounded-lg p-4">
            <div className="text-[10px] text-[#00d4ff] font-bold tracking-widest mb-2">VANI RECOMMENDATION</div>
            <p className="text-[11px] text-[#c0c8d8] leading-relaxed">{item.recommendation}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="bg-[#0a1628] border border-[#1a2035] rounded-lg p-3"><div className="text-[10px] text-[#4a5568] tracking-widest">REVIEWED BY</div><div className="text-white font-semibold mt-1">{item.reviewer}</div></div>
            <div className="bg-[#0a1628] border border-[#1a2035] rounded-lg p-3"><div className="text-[10px] text-[#4a5568] tracking-widest">DATE</div><div className="text-white font-semibold mt-1">{item.date}</div></div>
          </div>
          {item.actions.length > 0 && (
            <div>
              <div className="text-[10px] text-[#4a5568] tracking-widest uppercase mb-3">Actions</div>
              <div className="space-y-2">
                {item.actions.map(({ label, icon: Icon, toast }) => {
                  const done = actionDone.includes(label);
                  const running = actionRunning === label;
                  return (
                    <button key={label} onClick={() => !done && !running && runAction(label, toast)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all
                        ${done ? "bg-green-500/10 border-green-500/20 text-green-400 cursor-default"
                          : running ? "bg-[#0066ff]/10 border-[#0066ff]/30 text-[#00d4ff]"
                            : "bg-[#0a1628] border-[#1a2035] text-white hover:border-[#0066ff]/40"}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? "bg-green-500/20" : running ? "bg-[#0066ff]/20" : "bg-[#1a2035]"}`}>
                        {done ? <Check size={13} className="text-green-400" /> : running ? <Loader size={13} className="animate-spin text-[#00d4ff]" /> : <Icon size={13} className="text-[#00d4ff]" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold">{label}</div>
                        <div className="text-[10px] text-[#4a5568] mt-0.5">{done ? "Completed — logged" : running ? "Executing via Vani..." : "Click to execute"}</div>
                      </div>
                      {!done && !running && <ArrowRight size={12} className="text-[#4a5568]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QAReview() {
  const [selected, setSelected] = useState<typeof qaItems[0] | null>(null);
  const fails = qaItems.filter(q => q.status === "fail").length;
  const warnings = qaItems.filter(q => q.status === "warning").length;
  const passes = qaItems.filter(q => q.status === "pass").length;

  return (
    <>
      {selected && <QAModal item={selected} onClose={() => setSelected(null)} />}
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total QA Items", value: String(qaItems.length), color: "#00d4ff" },
            { label: "Passed", value: String(passes), color: "#00ff88" },
            { label: "Warnings", value: String(warnings), color: "#f59e0b" },
            { label: "Failed", value: String(fails), color: "#ff4d6d" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-4">
              <div className="text-[10px] text-[#4a5568] tracking-widest uppercase mb-2">{label}</div>
              <div className="text-2xl font-bold" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-white tracking-widest uppercase border-l-2 border-[#00d4ff] pl-3">QA Exception Log</div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2035] rounded-lg text-[11px] text-[#4a5568] hover:text-white transition-colors"><Download size={11} /> Export Audit Report</button>
                <div className="text-[10px] text-[#4a5568] self-center">Click any row to drill down</div>
              </div>
            </div>
            <div className="bg-[#0d1117] border border-[#1a2035] rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-[#1a2035]">
                  {["QA ID", "Contract", "Type", "Check", "Severity", "Status", "Date", ""].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 text-[10px] text-[#4a5568] tracking-widest uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {qaItems.map((item) => {
                    const Icon = item.status === "pass" ? CheckCircle : item.status === "fail" ? XCircle : AlertTriangle;
                    const iconColor = item.status === "pass" ? "text-green-400" : item.status === "fail" ? "text-[#ff4d6d]" : "text-yellow-400";
                    return (
                      <tr key={item.id} onClick={() => setSelected(item)} className="border-b border-[#1a2035]/50 hover:bg-[#0a1628] transition-colors cursor-pointer group">
                        <td className="px-3 py-2.5 text-[#00d4ff] font-mono text-[10px]">{item.id}</td>
                        <td className="px-3 py-2.5 text-white font-semibold text-[11px]">{item.contract}</td>
                        <td className="px-3 py-2.5 text-[#4a5568] text-[10px]">{item.type}</td>
                        <td className="px-3 py-2.5 text-[#4a5568] text-[10px]">{item.check}</td>
                        <td className="px-3 py-2.5">{item.severity ? <span className="text-[10px] font-bold uppercase" style={{ color: severityColors[item.severity] }}>{item.severity}</span> : <span className="text-[10px] text-[#4a5568]">—</span>}</td>
                        <td className="px-3 py-2.5"><div className={`flex items-center gap-1.5 text-[11px] font-semibold ${iconColor}`}><Icon size={11} />{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</div></td>
                        <td className="px-3 py-2.5 text-[#4a5568] text-[10px]">{item.date}</td>
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

          <div>
            <div className="text-xs font-bold text-white tracking-widest uppercase border-l-2 border-[#00d4ff] pl-3 mb-3">Audit Readiness</div>
            <div className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-4 space-y-3">
              {auditChecklist.map(({ category, items, passed }) => {
                const pct = Math.round((passed / items) * 100);
                return (
                  <div key={category} className="pb-3 border-b border-[#1a2035]/50 last:border-0 last:pb-0">
                    <div className="flex justify-between mb-1"><span className="text-[11px] text-white">{category}</span><span className="text-[10px] text-[#4a5568]">{passed}/{items}</span></div>
                    <div className="h-1.5 bg-[#1a2035] rounded-full"><div className={`h-full rounded-full ${pct === 100 ? "bg-green-400" : pct >= 90 ? "bg-[#00d4ff]" : "bg-yellow-400"}`} style={{ width: `${pct}%` }} /></div>
                    <div className={`text-[10px] mt-0.5 ${pct === 100 ? "text-green-400" : "text-yellow-400"}`}>{pct === 100 ? "✓ Complete" : `${pct}%`}</div>
                  </div>
                );
              })}
              <div className="pt-2 bg-[#0a1628] rounded-lg p-3 border border-[#1a2035]">
                <div className="text-[10px] text-[#4a5568] tracking-widest uppercase mb-1">Overall Audit Score</div>
                <div className="text-2xl font-bold text-white">91%</div>
                <div className="text-[10px] text-yellow-400 mt-0.5">Est. ready: March 28, 2026</div>
              </div>
              <button className="w-full py-2 bg-[#0066ff] rounded-lg text-[11px] text-white hover:bg-[#0052cc] transition-colors">Generate Audit Package</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
