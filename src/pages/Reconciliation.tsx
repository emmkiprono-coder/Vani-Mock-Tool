import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle, CheckCircle, XCircle, Zap, Send,
  X, FileText, Download, Mail,
  AlertCircle, ArrowRight, Check, Loader, Eye, CreditCard, Ban
} from "lucide-react";

const batches = [
  {
    id: "REC-2026-Q1-001", vendor: "Cardinal Health", gpo: "Premier",
    invoiced: 124500, expected: 124500, variance: 0, status: "matched",
    items: 847, matchRate: 100, period: "Q1 2026", contractId: "AH-2024-0847",
    daysOpen: 0, assignee: "Auto-Closed",
    lineItems: [
      { sku: "CH-IV-0012", desc: "IV Sets 10-Drop", qty: 1200, unit: 0.42, invoiced: 504, expected: 504, match: true },
      { sku: "CH-SYR-044", desc: "Syringes 10mL Luer", qty: 4800, unit: 0.18, invoiced: 864, expected: 864, match: true },
      { sku: "CH-GLV-099", desc: "Nitrile Gloves XL", qty: 2400, unit: 0.09, invoiced: 216, expected: 216, match: true },
    ],
    history: [
      { date: "Mar 10", event: "Batch submitted by Cardinal Health EDI", type: "info" },
      { date: "Mar 10", event: "AI match completed — 847/847 items verified", type: "success" },
      { date: "Mar 10", event: "Payment confirmed — auto-closed", type: "success" },
    ]
  },
  {
    id: "REC-2026-Q1-002", vendor: "Medline Industries", gpo: "Vizient",
    invoiced: 98200, expected: 116400, variance: -18200, status: "variance",
    items: 312, matchRate: 78, period: "Q1 2026", contractId: "AH-2024-0312",
    daysOpen: 14, assignee: "Vani / DisputeResolver",
    lineItems: [
      { sku: "ML-PPE-201", desc: "Isolation Gowns Level 3", qty: 6000, unit: 2.10, invoiced: 12600, expected: 12600, match: true },
      { sku: "ML-SRG-055", desc: "Surgical Drapes 75x90", qty: 800, unit: 18.50, invoiced: 14800, expected: 14800, match: true },
      { sku: "ML-WND-032", desc: "Wound Closure Strips", qty: 9600, unit: 0.74, invoiced: 0, expected: 7104, match: false },
      { sku: "ML-TRP-019", desc: "Tracheal Care Kit", qty: 240, unit: 46.23, invoiced: 0, expected: 11095, match: false },
    ],
    history: [
      { date: "Feb 25", event: "Batch submitted by Medline via EDI 835", type: "info" },
      { date: "Feb 25", event: "AI detected $18,200 shortfall — 2 SKUs missing", type: "warning" },
      { date: "Feb 26", event: "Auto-notice sent to Medline AR portal", type: "info" },
      { date: "Mar 08", event: "No response from Medline — SLA day 11", type: "warning" },
    ]
  },
  {
    id: "REC-2026-Q1-003", vendor: "Stryker Corp", gpo: "HPG",
    invoiced: 355000, expected: 341200, variance: 13800, status: "overpayment",
    items: 94, matchRate: 88, period: "Q1 2026", contractId: "AH-2025-0101",
    daysOpen: 8, assignee: "Vani / ContractOps",
    lineItems: [
      { sku: "STR-HIP-001", desc: "Hip Replacement System", qty: 4, unit: 18500, invoiced: 74000, expected: 74000, match: true },
      { sku: "STR-KNE-007", desc: "Knee Implant Tibial Tray", qty: 6, unit: 22400, invoiced: 134400, expected: 134400, match: true },
      { sku: "STR-INS-088", desc: "Instrument Set Rental", qty: 12, unit: 1150, invoiced: 27600, expected: 13800, match: false },
    ],
    history: [
      { date: "Mar 02", event: "Stryker submitted invoice with instrument rental", type: "info" },
      { date: "Mar 02", event: "AI flagged: instrument rental charged twice — $13,800 over", type: "warning" },
      { date: "Mar 03", event: "Overpayment confirmed by contract review team", type: "warning" },
      { date: "Mar 05", event: "Credit memo request sent to Stryker", type: "info" },
    ]
  },
  {
    id: "REC-2026-Q1-004", vendor: "Becton Dickinson", gpo: "Premier",
    invoiced: 44800, expected: 44800, variance: 0, status: "matched",
    items: 203, matchRate: 100, period: "Q1 2026", contractId: "AH-2024-0589",
    daysOpen: 0, assignee: "Auto-Closed",
    lineItems: [
      { sku: "BD-NDL-440", desc: "Needles 18G 1.5in", qty: 12000, unit: 0.12, invoiced: 1440, expected: 1440, match: true },
      { sku: "BD-SYR-660", desc: "Syringes 3mL BD Slip", qty: 9600, unit: 0.22, invoiced: 2112, expected: 2112, match: true },
    ],
    history: [
      { date: "Mar 08", event: "Batch auto-matched — full compliance", type: "success" },
      { date: "Mar 08", event: "Payment applied — closed", type: "success" },
    ]
  },
  {
    id: "REC-2026-Q1-005", vendor: "Baxter International", gpo: "Vizient",
    invoiced: 168200, expected: 170000, variance: -1800, status: "variance",
    items: 156, matchRate: 96, period: "Q1 2026", contractId: "AH-2025-0204",
    daysOpen: 5, assignee: "Vani / AutoResolve",
    lineItems: [
      { sku: "BAX-IV-100", desc: "NS 0.9% 1000mL Bags", qty: 2400, unit: 2.85, invoiced: 6840, expected: 6840, match: true },
      { sku: "BAX-D5W-250", desc: "D5W 250mL Bags", qty: 1800, unit: 2.40, invoiced: 4320, expected: 4320, match: true },
      { sku: "BAX-TPN-001", desc: "TPN Admixture Base", qty: 60, unit: 30.00, invoiced: 0, expected: 1800, match: false },
    ],
    history: [
      { date: "Mar 07", event: "Baxter EDI submission received", type: "info" },
      { date: "Mar 07", event: "$1,800 variance on TPN line — likely billing lag", type: "warning" },
      { date: "Mar 09", event: "Vani auto-resolution in progress", type: "info" },
    ]
  },
  {
    id: "REC-2026-Q1-006", vendor: "McKesson Corp", gpo: "Premier",
    invoiced: 0, expected: 738000, variance: -738000, status: "missing",
    items: 0, matchRate: 0, period: "Q1 2026", contractId: "AH-2025-0033",
    daysOpen: 52, assignee: "ESCALATED — SVP Fernando",
    lineItems: [],
    history: [
      { date: "Jan 18", event: "Q1 rebate payment expected per contract AH-2025-0033", type: "info" },
      { date: "Feb 28", event: "Payment not received — SLA Day 30 alert triggered", type: "warning" },
      { date: "Mar 05", event: "Second notice sent to McKesson AR", type: "warning" },
      { date: "Mar 10", event: "SLA breach — Day 52. Late penalty $36,900 invoked (Section 8.3)", type: "danger" },
      { date: "Mar 12", event: "Escalated to SVP Fernando office", type: "danger" },
    ]
  },
];

const initChat = [
  { role: "agent", msg: "Vani online — Q1 2026 reconciliation complete. Total exposure: $758,000 across 4 exceptions. Recommend starting with McKesson — $738K missing payment at Day 52." },
  { role: "user", msg: "Show me the McKesson situation." },
  { role: "agent", msg: "McKesson Corp — Contract AH-2025-0033 (Premier Tier 1, 6.0%). Expected Q1 rebate: $738,000. Days outstanding: 52. SLA breach at Day 45. I've invoked the late payment penalty clause Section 8.3 — $36,900 penalty accruing. Two prior notices sent, no response. I recommend escalating to McKesson's VP of Customer Finance and looping in SVP Fernando. Shall I draft the escalation?" },
  { role: "user", msg: "Yes. Also handle the Stryker overpayment." },
  { role: "agent", msg: "Escalation drafted for McKesson — sending to VP John Marks + copying SVP Fernando EA. For Stryker: $13,800 overpayment traced to double-billing of instrument set rentals (STR-INS-088). Credit memo requested. Apply to Q2 cycle?" },
];

const agentResponses = [
  "Done. Dispute case created and vendor notified via EDI acknowledgment. I'll monitor for response and alert you if SLA is at risk.",
  "Confirmed. Credit memo applied to next billing cycle — reflects in Q2 reconciliation. Action logged with timestamp for audit trail.",
  "Running root cause analysis... Discrepancy traces to a unit-of-measure mismatch in the vendor EDI 835 file. Correction request sent to their EDI coordinator.",
  "Escalation sent. CC'd SVP Fernando EA and Premier GPO contract manager. Response expected within 24-48 hours per escalation SLA.",
  "Partial payment accepted and posted. Variance of $18,200 held pending corrected invoice from Medline. Batch status updated.",
  "Batch placed on hold. Vendor notified — 5-day response window per contract terms. Vani will auto-escalate if no response.",
];

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 bg-[#0d1117] border border-green-500/40 rounded-xl px-4 py-3 shadow-2xl">
      <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
      <span className="text-xs text-white max-w-xs">{msg}</span>
    </div>
  );
}

function RunningOverlay({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Connecting to ERP & EDI feeds...",
    "Parsing EDI X12 835 files — 6 batches queued...",
    "Matching invoices to contract line items...",
    "Running variance detection algorithms...",
    "Flagging exceptions and generating disputes...",
    "Reconciliation complete — 4 exceptions found.",
  ];
  useEffect(() => {
    if (step < steps.length - 1) {
      const t = setTimeout(() => setStep(s => s + 1), 700);
      return () => clearTimeout(t);
    } else { setTimeout(onDone, 800); }
  }, [step]);
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-[60] flex items-center justify-center">
      <div className="bg-[#0d1117] border border-[#0066ff]/40 rounded-2xl p-8 w-96">
        <div className="w-12 h-12 rounded-full border-2 border-[#0066ff] border-t-[#00d4ff] animate-spin mx-auto mb-4" />
        <div className="text-sm font-bold text-white mb-4 tracking-wider text-center">Vani Running Reconciliation</div>
        <div className="space-y-2">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-2 text-[11px] transition-all ${i < step ? "text-green-400" : i === step ? "text-[#00d4ff]" : "text-[#1a2035]"}`}>
              {i < step ? <Check size={11} className="flex-shrink-0" /> : i === step ? <Loader size={11} className="animate-spin flex-shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full border border-[#1a2035] flex-shrink-0" />}
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BatchDetail({ batch, onClose, onAction }: { batch: typeof batches[0]; onClose: () => void; onAction: (msg: string) => void }) {
  const [tab, setTab] = useState<"overview" | "lineitems" | "history" | "actions">("overview");
  const [actionRunning, setActionRunning] = useState<string | null>(null);
  const [actionDone, setActionDone] = useState<string[]>([]);

  const runAction = (label: string, toast: string) => {
    setActionRunning(label);
    setTimeout(() => { setActionRunning(null); setActionDone(d => [...d, label]); onAction(toast); }, 2000);
  };

  const varColor = batch.variance === 0 ? "text-green-400" : batch.variance > 0 ? "text-[#ff4d6d]" : "text-yellow-400";

  const allActions = {
    missing: [
      { label: "Send Payment Demand Letter", icon: Mail, toast: "Payment demand letter sent to McKesson VP of Finance. Copied SVP Fernando." },
      { label: "Invoke Late Payment Penalty §8.3", icon: AlertCircle, toast: "Late payment penalty of $36,900 formally invoked. Logged in contract record." },
      { label: "Escalate to GPO (Premier)", icon: ArrowRight, toast: "Premier GPO notified. Dispute mediation request submitted — ref #GPO-2026-0044." },
      { label: "Download Full Demand Package", icon: Download, toast: "Demand package downloaded — includes contract terms, SLA timeline, and penalty calc." },
    ],
    variance: [
      { label: "Request Corrected Invoice", icon: Mail, toast: `Corrected invoice request sent to ${batch.vendor} EDI coordinator.` },
      { label: "Open Formal Dispute Case", icon: FileText, toast: `Dispute case DR-2026-${batch.id.slice(-3)} opened. Assigned to DisputeResolver agent.` },
      { label: "Accept Partial Payment", icon: CreditCard, toast: `Partial payment of $${batch.invoiced.toLocaleString()} accepted. Variance held pending resolution.` },
      { label: "Place Batch on Hold", icon: Ban, toast: `Batch ${batch.id} placed on hold. Vendor has 5 business days to respond.` },
    ],
    overpayment: [
      { label: "Request Credit Memo", icon: FileText, toast: `Credit memo request sent to ${batch.vendor} — $${Math.abs(batch.variance).toLocaleString()} applied in Q2.` },
      { label: "Apply Credit to Next Invoice", icon: CreditCard, toast: `$${Math.abs(batch.variance).toLocaleString()} credit flagged for automatic Q2 application.` },
      { label: "Notify AP Team", icon: Mail, toast: "AP team notified of overpayment — adjustment memo filed and logged." },
    ],
    matched: [
      { label: "Download Remittance Report", icon: Download, toast: "Remittance report PDF downloaded — audit-ready." },
      { label: "Archive Batch", icon: Check, toast: `Batch ${batch.id} archived to document repository.` },
    ],
  };

  const actions = allActions[batch.status as keyof typeof allActions] || allActions.matched;

  const statusIcon = batch.status === "matched" ? <CheckCircle size={14} className="text-green-400" /> :
    batch.status === "missing" ? <XCircle size={14} className="text-[#ff4d6d]" /> :
      <AlertTriangle size={14} className="text-yellow-400" />;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0d1117] border border-[#2a3350] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#1a2035] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {statusIcon}
              <span className="text-sm font-bold text-white">{batch.vendor}</span>
              <span className="text-[10px] text-[#4a5568] font-mono">{batch.id}</span>
            </div>
            <div className="text-[11px] text-[#4a5568]">{batch.gpo} · {batch.period} · Contract {batch.contractId}</div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#4a5568] hover:text-white rounded-lg hover:bg-[#1a2035] transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="flex border-b border-[#1a2035] px-5 flex-shrink-0">
          {(["overview", "lineitems", "history", "actions"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-[11px] tracking-widest uppercase transition-colors relative ${tab === t ? "text-[#00d4ff]" : "text-[#4a5568] hover:text-white"}`}>
              {t === "lineitems" ? "Line Items" : t.charAt(0).toUpperCase() + t.slice(1)}
              {tab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d4ff]" />}
              {t === "actions" && actionDone.length > 0 && (
                <span className="ml-1 px-1 bg-green-500/20 border border-green-500/30 rounded text-[9px] text-green-400">{actionDone.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Invoiced Amount", value: `$${batch.invoiced.toLocaleString()}`, color: "text-white" },
                  { label: "Expected Amount", value: `$${batch.expected.toLocaleString()}`, color: "text-white" },
                  { label: "Variance", value: batch.variance === 0 ? "$0" : `${batch.variance > 0 ? "+" : ""}$${batch.variance.toLocaleString()}`, color: varColor },
                  { label: "Match Rate", value: `${batch.matchRate}%`, color: batch.matchRate === 100 ? "text-green-400" : batch.matchRate >= 85 ? "text-yellow-400" : "text-[#ff4d6d]" },
                  { label: "Days Open", value: batch.daysOpen === 0 ? "Closed" : `${batch.daysOpen} days`, color: batch.daysOpen > 30 ? "text-[#ff4d6d]" : "text-white" },
                  { label: "Assigned To", value: batch.assignee, color: "text-[#00d4ff]" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-[#0a1628] border border-[#1a2035] rounded-lg p-3">
                    <div className="text-[10px] text-[#4a5568] tracking-widest uppercase mb-1">{label}</div>
                    <div className={`text-sm font-bold ${color}`}>{value}</div>
                  </div>
                ))}
              </div>
              {batch.status !== "matched" && (
                <div className={`rounded-lg p-4 border ${batch.status === "missing" ? "bg-[#ff4d6d]/5 border-[#ff4d6d]/20" : "bg-yellow-500/5 border-yellow-500/20"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={13} className={batch.status === "missing" ? "text-[#ff4d6d]" : "text-yellow-400"} />
                    <span className={`text-[11px] font-bold tracking-widest ${batch.status === "missing" ? "text-[#ff4d6d]" : "text-yellow-400"}`}>
                      {batch.status === "missing" ? "CRITICAL — PAYMENT MISSING" : batch.status === "overpayment" ? "OVERPAYMENT DETECTED" : "VARIANCE REQUIRES RESOLUTION"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#c0c8d8] leading-relaxed">
                    {batch.status === "missing" && "McKesson has not submitted Q1 2026 rebate payment of $738,000. Contract SLA was 45 days — currently Day 52. Late payment penalty of $36,900 has been invoked per Section 8.3 of contract AH-2025-0033."}
                    {batch.status === "variance" && `Variance of $${Math.abs(batch.variance).toLocaleString()} detected. ${batch.lineItems.filter(l => !l.match).length} line item(s) missing from vendor submission. Review the Line Items tab for full breakdown.`}
                    {batch.status === "overpayment" && `Vendor submitted an invoice $${Math.abs(batch.variance).toLocaleString()} above contracted amount. Instrument set rental (STR-INS-088) was double-billed. Credit memo requested.`}
                  </p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button onClick={() => setTab("actions")} className="flex-1 py-2 bg-[#0066ff] rounded-lg text-xs text-white hover:bg-[#0052cc] transition-colors font-semibold">
                  Take Action
                </button>
                <button onClick={() => setTab("lineitems")} className="flex-1 py-2 bg-[#1a2035] rounded-lg text-xs text-[#4a5568] hover:text-white transition-colors">
                  View Line Items
                </button>
                <button onClick={() => setTab("history")} className="flex-1 py-2 bg-[#1a2035] rounded-lg text-xs text-[#4a5568] hover:text-white transition-colors">
                  History
                </button>
              </div>
            </div>
          )}

          {tab === "lineitems" && (
            <div>
              {batch.lineItems.length === 0 ? (
                <div className="text-center py-12 text-[#4a5568]">
                  <XCircle size={32} className="mx-auto mb-3 text-[#ff4d6d]/40" />
                  <p className="text-sm text-white">No line items received from vendor.</p>
                  <p className="text-[11px] mt-1">McKesson has not submitted any EDI 835 data for this period.</p>
                  <button onClick={() => setTab("actions")} className="mt-4 px-4 py-2 bg-[#0066ff] rounded-lg text-xs text-white hover:bg-[#0052cc] transition-colors">
                    Take Action Now
                  </button>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#1a2035]">
                      {["SKU", "Description", "Qty", "Unit $", "Invoiced", "Expected", "Status"].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-[10px] text-[#4a5568] tracking-widest uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {batch.lineItems.map((li, i) => (
                      <tr key={i} className={`border-b border-[#1a2035]/50 ${!li.match ? "bg-yellow-500/5" : ""}`}>
                        <td className="px-3 py-2.5 font-mono text-[10px] text-[#00d4ff]">{li.sku}</td>
                        <td className="px-3 py-2.5 text-white">{li.desc}</td>
                        <td className="px-3 py-2.5 text-[#4a5568]">{li.qty.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-[#4a5568]">${li.unit.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-white">{li.invoiced > 0 ? `$${li.invoiced.toLocaleString()}` : <span className="text-[#ff4d6d]">—</span>}</td>
                        <td className="px-3 py-2.5 text-white">${li.expected.toLocaleString()}</td>
                        <td className="px-3 py-2.5">
                          {li.match
                            ? <span className="flex items-center gap-1 text-green-400 text-[10px]"><CheckCircle size={11} />Matched</span>
                            : <span className="flex items-center gap-1 text-yellow-400 text-[10px]"><AlertTriangle size={11} />Unmatched</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {tab === "history" && (
            <div className="space-y-1">
              {batch.history.map((h, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center pt-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${h.type === "success" ? "bg-green-400" : h.type === "warning" ? "bg-yellow-400" : h.type === "danger" ? "bg-[#ff4d6d]" : "bg-[#00d4ff]"}`} />
                    {i < batch.history.length - 1 && <div className="w-px h-8 bg-[#1a2035] mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <span className="text-[10px] text-[#4a5568] font-mono">{h.date}</span>
                    <p className={`text-[11px] leading-relaxed mt-0.5 ${h.type === "success" ? "text-green-400" : h.type === "danger" ? "text-[#ff4d6d]" : h.type === "warning" ? "text-yellow-300" : "text-[#c0c8d8]"}`}>
                      {h.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "actions" && (
            <div className="space-y-3">
              <p className="text-[11px] text-[#4a5568] mb-4 leading-relaxed">
                Vani has pre-analyzed this batch. Each action is logged with a timestamp for full audit trail. Click to execute.
              </p>
              {actions.map(({ label, icon: Icon, toast }) => {
                const done = actionDone.includes(label);
                const running = actionRunning === label;
                return (
                  <button key={label} onClick={() => !done && !running && runAction(label, toast)}
                    disabled={done}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all
                      ${done ? "bg-green-500/10 border-green-500/20 text-green-400 cursor-default"
                        : running ? "bg-[#0066ff]/10 border-[#0066ff]/30 text-[#00d4ff] cursor-wait"
                          : "bg-[#0a1628] border-[#1a2035] text-white hover:border-[#0066ff]/40 hover:bg-[#0a1628] cursor-pointer"}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? "bg-green-500/20" : running ? "bg-[#0066ff]/20" : "bg-[#1a2035]"}`}>
                      {done ? <Check size={15} className="text-green-400" /> : running ? <Loader size={15} className="animate-spin text-[#00d4ff]" /> : <Icon size={15} className="text-[#00d4ff]" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold">{label}</div>
                      {done && <div className="text-[10px] text-green-400 mt-0.5">Completed — logged in audit trail</div>}
                      {running && <div className="text-[10px] text-[#00d4ff] mt-0.5">Executing via Vani agent...</div>}
                      {!done && !running && <div className="text-[10px] text-[#4a5568] mt-0.5">Click to execute</div>}
                    </div>
                    {!done && !running && <ArrowRight size={13} className="text-[#4a5568] flex-shrink-0" />}
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

export default function Reconciliation() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(initChat);
  const [running, setRunning] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<typeof batches[0] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState(false);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setMessages(m => [...m, { role: "user", msg }]);
    setChatInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const resp = agentResponses[Math.floor(Math.random() * agentResponses.length)];
      setMessages(m => [...m, { role: "agent", msg: resp }]);
    }, 1500);
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, typing]);

  const statusMeta: Record<string, { label: string; color: string; icon: any }> = {
    matched: { label: "Matched", color: "text-green-400", icon: CheckCircle },
    variance: { label: "Variance", color: "text-yellow-400", icon: AlertTriangle },
    overpayment: { label: "Overpayment", color: "text-[#ff4d6d]", icon: AlertTriangle },
    missing: { label: "Missing", color: "text-[#ff4d6d]", icon: XCircle },
  };

  const exposure = Math.abs(batches.filter(b => b.variance < 0).reduce((s, b) => s + b.variance, 0));

  return (
    <>
      {running && <RunningOverlay onDone={() => { setRunning(false); setToast("Vani reconciliation complete — 4 exceptions flagged, 2 batches auto-matched."); }} />}
      {selectedBatch && (
        <BatchDetail batch={selectedBatch} onClose={() => setSelectedBatch(null)} onAction={(msg) => { setToast(msg); }} />
      )}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-180px)]">
        <div className="col-span-2 flex flex-col gap-4 overflow-hidden">
          <div className="grid grid-cols-4 gap-3 flex-shrink-0">
            {[
              { label: "Batches", value: String(batches.length), color: "#00d4ff" },
              { label: "Auto-Matched", value: String(batches.filter(b => b.status === "matched").length), color: "#00ff88" },
              { label: "Exceptions", value: String(batches.filter(b => b.status !== "matched").length), color: "#f59e0b" },
              { label: "Net Exposure", value: `$${(exposure / 1000).toFixed(0)}K`, color: "#ff4d6d" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-3">
                <div className="text-[10px] text-[#4a5568] tracking-widest uppercase">{label}</div>
                <div className="text-xl font-bold mt-1" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => setRunning(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0066ff] rounded-lg text-xs text-white hover:bg-[#0052cc] transition-colors font-semibold">
              <Zap size={12} /> Run Full Reconciliation
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2035] rounded-lg text-xs text-[#4a5568] hover:text-white transition-colors">
              <Download size={12} /> Export Report
            </button>
            <div className="ml-auto flex items-center gap-1.5 text-[10px] text-[#4a5568]">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Click any row to drill down
            </div>
          </div>

          <div className="flex-1 bg-[#0d1117] border border-[#1a2035] rounded-xl overflow-hidden flex flex-col">
            <table className="w-full text-xs flex-shrink-0">
              <thead>
                <tr className="border-b border-[#1a2035]">
                  {["Batch ID", "Vendor", "Invoiced", "Expected", "Variance", "Match %", "Status", "Days", ""].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 text-[10px] text-[#4a5568] tracking-widest uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
            </table>
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-xs">
                <tbody>
                  {batches.map((b) => {
                    const { color, icon: Icon } = statusMeta[b.status];
                    return (
                      <tr key={b.id} onClick={() => setSelectedBatch(b)}
                        className="border-b border-[#1a2035]/50 hover:bg-[#0a1628] transition-colors cursor-pointer group">
                        <td className="px-3 py-3 text-[#00d4ff] font-mono text-[10px]">{b.id}</td>
                        <td className="px-3 py-3 text-white font-semibold">{b.vendor}</td>
                        <td className="px-3 py-3 text-[#c0c8d8]">${b.invoiced.toLocaleString()}</td>
                        <td className="px-3 py-3 text-[#c0c8d8]">${b.expected.toLocaleString()}</td>
                        <td className={`px-3 py-3 font-bold ${b.variance === 0 ? "text-green-400" : b.variance > 0 ? "text-[#ff4d6d]" : "text-yellow-400"}`}>
                          {b.variance === 0 ? "$0" : `${b.variance > 0 ? "+" : ""}$${b.variance.toLocaleString()}`}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="h-1 w-12 bg-[#1a2035] rounded-full">
                              <div className={`h-full rounded-full ${b.matchRate === 100 ? "bg-green-400" : b.matchRate >= 85 ? "bg-yellow-400" : "bg-[#ff4d6d]"}`}
                                style={{ width: `${b.matchRate}%` }} />
                            </div>
                            <span className="text-[10px] text-[#4a5568]">{b.matchRate}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${color}`}>
                            <Icon size={11} />{statusMeta[b.status].label}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`text-[11px] font-bold ${b.daysOpen > 30 ? "text-[#ff4d6d]" : b.daysOpen > 0 ? "text-yellow-400" : "text-[#4a5568]"}`}>
                            {b.daysOpen === 0 ? "—" : `${b.daysOpen}d`}
                          </span>
                        </td>
                        <td className="px-3 py-3">
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
        </div>

        {/* Vani Chat */}
        <div className="flex flex-col bg-[#0d1117] border border-[#1a2035] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1a2035] flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-[#00d4ff]" />
              <div className="absolute inset-0 rounded-full bg-[#00d4ff] animate-ping opacity-40" />
            </div>
            <span className="text-xs font-bold text-white">Vani</span>
            <span className="text-[10px] text-[#4a5568]">ReconcileBot Alpha</span>
            <span className="ml-auto text-[10px] text-green-400 tracking-widest">LIVE</span>
          </div>
          <div className="px-3 pt-2 pb-2 flex flex-wrap gap-1.5 flex-shrink-0 border-b border-[#1a2035]">
            {["Resolve McKesson", "Stryker credit", "All variances", "Audit summary"].map(p => (
              <button key={p} onClick={() => setChatInput(p)}
                className="px-2 py-1 bg-[#0a1628] border border-[#1a2035] rounded text-[10px] text-[#4a5568] hover:text-[#00d4ff] hover:border-[#0066ff]/30 transition-colors">
                {p}
              </button>
            ))}
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] rounded-xl px-3 py-2 text-[11px] leading-relaxed
                  ${m.role === "user" ? "bg-[#0066ff]/20 border border-[#0066ff]/30 text-white" : "bg-[#0a1628] border border-[#1a2035] text-[#c0c8d8]"}`}>
                  {m.role === "agent" && (
                    <div className="flex items-center gap-1 mb-1">
                      <Zap size={9} className="text-[#00d4ff]" />
                      <span className="text-[9px] text-[#00d4ff] font-bold tracking-widest">VANI</span>
                    </div>
                  )}
                  {m.msg}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-[#0a1628] border border-[#1a2035] rounded-xl px-3 py-2 flex gap-1 items-center">
                  {[0, 150, 300].map(d => (
                    <div key={d} className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-[#1a2035] flex gap-2 flex-shrink-0">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-[#0a1628] border border-[#1a2035] rounded-lg px-3 py-2 text-[11px] text-white placeholder-[#4a5568] outline-none focus:border-[#0066ff]/40"
              placeholder="Ask Vani anything..." />
            <button onClick={sendMessage} className="p-2 bg-[#0066ff] rounded-lg hover:bg-[#0052cc] transition-colors flex-shrink-0">
              <Send size={12} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
