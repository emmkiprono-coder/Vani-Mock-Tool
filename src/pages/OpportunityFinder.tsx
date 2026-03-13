import { useState } from "react";
import { Lightbulb, TrendingUp, Zap, ArrowRight, Check, Loader, X, DollarSign, Target, Clock } from "lucide-react";

const opportunities = [
  { id: "OPP-001", type: "Tier Upgrade", vendor: "Stryker Corp", title: "Spend $780K more → Unlock Tier 2 (5.0% → 5.5%)", impact: 43000, confidence: 94, effort: "Low", timeline: "Q2 2026", category: "revenue", status: "new",
    detail: "Current YTD spend: $6.32M. Tier 2 threshold: $7.1M. Projected additional purchases in Orthopedic category bridge this gap by May 2026. Contract allows retroactive tier adjustment. Vani has modeled Q2 purchase plan and confirmed feasibility.",
    steps: ["Confirm Q2 orthopedic purchase plan with Supply Chain", "Notify Stryker rep of tier upgrade intent", "Update contract AH-2025-0101 tier projection", "Monitor spend weekly via Vani dashboard"] },
  { id: "OPP-002", type: "Retroactive Claim", vendor: "Owens & Minor", title: "Missed Q4 2025 PPE rebate — retroactive claim window open", impact: 24500, confidence: 99, effort: "Low", timeline: "Immediate", category: "recovery", status: "urgent",
    detail: "Contract AH-2024-0445 Section 12.2 allows retroactive claims within 180 days. Q4 2025 PPE rebate of $24,500 was never submitted. Claim deadline: April 15, 2026. Vani has pre-filled the claim form — approval and submission required.",
    steps: ["Review pre-filled claim form (Vani)", "Attach supporting purchase orders", "Submit via Vizient portal", "Confirm receipt and log"] },
  { id: "OPP-003", type: "GPO Enrollment", vendor: "Becton Dickinson", title: "BD Diagnostics not enrolled in Premier Tier 3 — forfeiting 0.5%", impact: 8000, confidence: 87, effort: "Medium", timeline: "Q2 2026", category: "optimization", status: "new",
    detail: "BD Diagnostics division eligible for Premier GPO Tier 3 enrollment based on current lab spend. Enrollment retroactively applies from contract anniversary. Estimated annual uplift: $8,000. Vani found the enrollment gap during weekly portfolio scan.",
    steps: ["Complete Premier enrollment form for BD Diagnostics division", "Submit to Premier contract management portal", "Await 2-week processing window", "Confirm tier adjustment and retroactive rebate"] },
  { id: "OPP-004", type: "Renegotiation", vendor: "Cardinal Health", title: "Market benchmark shows 0.4% gap vs comparable contracts", impact: 168000, confidence: 78, effort: "High", timeline: "Q3 2026", category: "optimization", status: "new",
    detail: "Vani benchmarked 12 comparable Premier distributor contracts. Cardinal Health averaging 3.4% market vs our 3.0%. Q3 2026 renewal is the trigger — recommend opening rate discussions 90 days early. Internal leverage: $4.2M annual spend, 99% compliance, 5-year relationship.",
    steps: ["Request market rate benchmark report from Premier", "Brief SVP Fernando on negotiation strategy", "Engage Cardinal Health VP 90 days pre-renewal", "Target: 3.3% as floor, 3.5% as goal"] },
  { id: "OPP-005", type: "Volume Bundling", vendor: "McKesson Corp", title: "Bundling specialty pharma + med-surg → Tier blended rate", impact: 320000, confidence: 82, effort: "Medium", timeline: "Q2-Q3 2026", category: "revenue", status: "analysis",
    detail: "McKesson offers blended rate if pharma + med-surg combined > $15M. Current combined: $14.1M. Q2 purchase plan brings combined to $15.8M — unlocking 6.5% blended rate vs current 6.0%. Pending McKesson payment dispute resolution.",
    steps: ["Resolve Q1 2026 payment dispute first", "Model Q2 purchase plan for combined threshold", "Negotiate bundled rate amendment to contract", "Execute and monitor combined spend"] },
  { id: "OPP-006", type: "Early Pay Incentive", vendor: "Baxter International", title: "2% early payment discount — net benefit vs opportunity cost", impact: 34000, confidence: 96, effort: "Low", timeline: "Immediate", category: "financial", status: "new",
    detail: "Baxter offers 2/10 net 60 early payment terms. Current AP cycle: 45 days. Shifting to 10-day cycle on $1.7M quarterly would yield $34K annual discount, offsetting opportunity cost at current treasury rate of 4.8%.",
    steps: ["Coordinate with AP to enable early payment for Baxter", "Confirm 2/10 terms in contract AH-2025-0204", "Process first early payment in next billing cycle", "Track savings in Vani analytics"] },
  { id: "OPP-007", type: "Contract Consolidation", vendor: "Multiple Vendors", title: "7 sub-GPO contracts eligible for Vizient master consolidation", impact: 145000, confidence: 71, effort: "High", timeline: "Q4 2026", category: "optimization", status: "analysis",
    detail: "7 independently-negotiated vendor contracts have lower rates than Vizient master agreements. Consolidation modeling shows $145K incremental rebate plus reduced admin burden (estimated 20 FTE hours/month). Requires Vizient contract amendment process.",
    steps: ["Identify 7 contracts eligible for Vizient consolidation", "Model rate differential for each vendor", "Initiate Vizient contract amendment", "Transition vendors over 90-day window"] },
];

const catColors: Record<string, string> = { revenue: "#00d4ff", recovery: "#00ff88", optimization: "#a78bfa", financial: "#f59e0b" };
const catLabels: Record<string, string> = { revenue: "Revenue Uplift", recovery: "Recovery", optimization: "Optimization", financial: "Financial" };
const statusStyles: Record<string, string> = { new: "text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/20", urgent: "text-[#ff4d6d] bg-[#ff4d6d]/10 border-[#ff4d6d]/20", analysis: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" };

function OppModal({ opp, onClose }: { opp: typeof opportunities[0]; onClose: () => void }) {
  const [stepsDone, setStepsDone] = useState<number[]>([]);
  const [stepRunning, setStepRunning] = useState<number | null>(null);
  const [launched, setLaunched] = useState(false);

  const runStep = (i: number) => {
    if (stepsDone.includes(i) || stepRunning !== null) return;
    setStepRunning(i);
    setTimeout(() => { setStepRunning(null); setStepsDone(d => [...d, i]); }, 1800);
  };

  const launchAll = () => {
    setLaunched(true);
    let delay = 0;
    opp.steps.forEach((_, i) => {
      setTimeout(() => setStepRunning(i), delay);
      delay += 1500;
      setTimeout(() => { setStepRunning(null); setStepsDone(d => [...d, i]); }, delay - 200);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0d1117] border border-[#2a3350] rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#1a2035] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: catColors[opp.category] + "20" }}>
                <Lightbulb size={11} style={{ color: catColors[opp.category] }} />
              </div>
              <span className="text-[10px]" style={{ color: catColors[opp.category] }}>{opp.type}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${statusStyles[opp.status]}`}>{opp.status.toUpperCase()}</span>
            </div>
            <div className="text-sm font-bold text-white">{opp.title}</div>
            <div className="text-[11px] text-[#4a5568] mt-0.5">{opp.vendor}</div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#4a5568] hover:text-white rounded hover:bg-[#1a2035] transition-colors"><X size={14} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0a1628] border border-[#1a2035] rounded-lg p-3 text-center">
              <DollarSign size={14} className="text-green-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-400">${opp.impact.toLocaleString()}</div>
              <div className="text-[10px] text-[#4a5568]">Est. Impact</div>
            </div>
            <div className="bg-[#0a1628] border border-[#1a2035] rounded-lg p-3 text-center">
              <Target size={14} className="text-[#00d4ff] mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{opp.confidence}%</div>
              <div className="text-[10px] text-[#4a5568]">Confidence</div>
            </div>
            <div className="bg-[#0a1628] border border-[#1a2035] rounded-lg p-3 text-center">
              <Clock size={14} className="text-[#a78bfa] mx-auto mb-1" />
              <div className="text-sm font-bold text-white">{opp.timeline}</div>
              <div className="text-[10px] text-[#4a5568]">Timeline</div>
            </div>
          </div>
          <div className="bg-[#0a1628] border border-[#0066ff]/20 rounded-lg p-4">
            <div className="text-[10px] text-[#00d4ff] font-bold tracking-widest mb-2">VANI ANALYSIS</div>
            <p className="text-[11px] text-[#c0c8d8] leading-relaxed">{opp.detail}</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] text-[#4a5568] tracking-widest uppercase">Action Steps</div>
              {!launched && stepsDone.length === 0 && (
                <button onClick={launchAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0066ff] rounded-lg text-[11px] text-white hover:bg-[#0052cc] transition-colors">
                  <Zap size={11} /> Execute All via Vani
                </button>
              )}
              {stepsDone.length === opp.steps.length && (
                <span className="text-[11px] text-green-400 font-bold">✓ All steps completed</span>
              )}
            </div>
            <div className="space-y-2">
              {opp.steps.map((step, i) => {
                const done = stepsDone.includes(i);
                const running = stepRunning === i;
                return (
                  <button key={i} onClick={() => runStep(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all
                      ${done ? "bg-green-500/10 border-green-500/20" : running ? "bg-[#0066ff]/10 border-[#0066ff]/30" : "bg-[#0a1628] border-[#1a2035] hover:border-[#0066ff]/30"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold
                      ${done ? "bg-green-500/20 text-green-400" : running ? "bg-[#0066ff]/20 text-[#00d4ff]" : "bg-[#1a2035] text-[#4a5568]"}`}>
                      {done ? <Check size={11} /> : running ? <Loader size={11} className="animate-spin" /> : i + 1}
                    </div>
                    <span className={`text-[11px] ${done ? "text-green-400" : running ? "text-[#00d4ff]" : "text-white"}`}>{step}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OpportunityFinder() {
  const [selected, setSelected] = useState<typeof opportunities[0] | null>(null);
  const [filterCat, setFilterCat] = useState<string | null>(null);

  const filtered = filterCat ? opportunities.filter(o => o.category === filterCat) : opportunities;
  const totalImpact = opportunities.reduce((s, o) => s + o.impact, 0);

  return (
    <>
      {selected && <OppModal opp={selected} onClose={() => setSelected(null)} />}
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-1 bg-gradient-to-br from-[#0066ff]/20 to-[#00d4ff]/10 border border-[#0066ff]/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><Lightbulb size={14} className="text-[#00d4ff]" /><span className="text-[10px] text-[#00d4ff] tracking-widest uppercase">Total Opportunity</span></div>
            <div className="text-2xl font-bold text-white">${(totalImpact / 1000).toFixed(0)}K</div>
            <div className="text-[10px] text-[#4a5568] mt-1">{opportunities.length} opportunities identified</div>
          </div>
          {[
            { label: "Immediate Action", value: "3", color: "#00ff88" },
            { label: "High Confidence ≥90%", value: "4", color: "#00d4ff" },
            { label: "Avg Confidence", value: "86%", color: "#a78bfa" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-4">
              <div className="text-[10px] text-[#4a5568] tracking-widest uppercase mb-2">{label}</div>
              <div className="text-2xl font-bold" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterCat(null)} className={`px-3 py-1.5 rounded-lg text-[11px] transition-colors ${!filterCat ? "bg-[#0066ff] text-white" : "bg-[#1a2035] text-[#4a5568] hover:text-white"}`}>All</button>
          {Object.entries(catLabels).map(([cat, label]) => (
            <button key={cat} onClick={() => setFilterCat(cat === filterCat ? null : cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] transition-colors border ${filterCat === cat ? "text-white" : "text-[#4a5568] hover:text-white border-transparent bg-[#1a2035]"}`}
              style={filterCat === cat ? { background: catColors[cat] + "20", borderColor: catColors[cat] + "60", color: catColors[cat] } : {}}>
              {label}
            </button>
          ))}
          <div className="ml-auto text-[10px] text-[#4a5568] self-center">Click any card to launch action plan</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filtered.map(opp => (
            <div key={opp.id} onClick={() => setSelected(opp)}
              className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-4 cursor-pointer hover:border-[#0066ff]/40 hover:bg-[#0a1628] transition-all group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: catColors[opp.category] + "20" }}>
                    <Lightbulb size={11} style={{ color: catColors[opp.category] }} />
                  </div>
                  <span className="text-[10px]" style={{ color: catColors[opp.category] }}>{opp.type}</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${statusStyles[opp.status]}`}>{opp.status.toUpperCase()}</span>
              </div>
              <div className="text-xs font-semibold text-white mb-3 leading-snug">{opp.title}</div>
              <div className="flex items-center justify-between">
                <div><div className="text-[10px] text-[#4a5568]">Impact</div><div className="text-sm font-bold text-green-400">${opp.impact.toLocaleString()}</div></div>
                <div className="text-right"><div className="text-[10px] text-[#4a5568]">Confidence</div><div className="text-sm font-bold text-white">{opp.confidence}%</div></div>
                <div className="text-right"><div className="text-[10px] text-[#4a5568]">Effort</div>
                  <div className={`text-[11px] font-semibold ${opp.effort === "Low" ? "text-green-400" : opp.effort === "Medium" ? "text-yellow-400" : "text-[#ff4d6d]"}`}>{opp.effort}</div>
                </div>
                <div className="text-right"><div className="text-[10px] text-[#4a5568]">Timeline</div><div className="text-[11px] text-[#00d4ff]">{opp.timeline}</div></div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#1a2035] flex items-center justify-between">
                <span className="text-[10px] text-[#4a5568]">{opp.steps.length} action steps</span>
                <div className="flex items-center gap-1 text-[10px] text-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity">
                  View Action Plan <ArrowRight size={10} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
