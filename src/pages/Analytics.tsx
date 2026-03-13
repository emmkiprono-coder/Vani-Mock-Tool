import { useState } from "react";
import { SectionHeader } from "../components/Shared";

const monthlyData = [
  { month: "Jul", rebate: 620, recovered: 580, disputed: 40 },
  { month: "Aug", rebate: 710, recovered: 695, disputed: 15 },
  { month: "Sep", rebate: 680, recovered: 650, disputed: 30 },
  { month: "Oct", rebate: 820, recovered: 800, disputed: 20 },
  { month: "Nov", rebate: 750, recovered: 720, disputed: 30 },
  { month: "Dec", rebate: 910, recovered: 875, disputed: 35 },
  { month: "Jan", rebate: 780, recovered: 760, disputed: 20 },
  { month: "Feb", rebate: 850, recovered: 810, disputed: 40 },
  { month: "Mar", rebate: 920, recovered: 880, disputed: 40 },
];

const vendorBreakdown = [
  { vendor: "McKesson Corp", amount: 738, pct: 24, color: "#0066ff" },
  { vendor: "Johnson & Johnson", amount: 261, pct: 18, color: "#00d4ff" },
  { vendor: "Baxter International", amount: 170, pct: 15, color: "#a78bfa" },
  { vendor: "Cardinal Health", amount: 126, pct: 13, color: "#00ff88" },
  { vendor: "Stryker Corp", amount: 355, pct: 12, color: "#f59e0b" },
  { vendor: "Others", amount: 186, pct: 18, color: "#4a5568" },
];

const gpoPerformance = [
  { gpo: "Premier", contracts: 34, rebate: "$3.2M", compliance: 98.4, trend: "+2.1%" },
  { gpo: "Vizient", contracts: 28, rebate: "$2.8M", compliance: 97.1, trend: "+1.4%" },
  { gpo: "HPG", contracts: 22, rebate: "$2.47M", compliance: 96.8, trend: "+0.8%" },
];

const maxRebate = Math.max(...monthlyData.map(d => d.rebate));

export default function Analytics() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "YTD Rebate Revenue", value: "$8.47M", change: "+12.3%", up: true },
          { label: "Avg Rebate Rate", value: "4.2%", change: "+0.3%", up: true },
          { label: "Recovery Rate", value: "97.3%", change: "+0.8%", up: true },
          { label: "Disputed Amount", value: "$312K", change: "-18%", up: false },
        ].map(({ label, value, change, up }) => (
          <div key={label} className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-4">
            <div className="text-[10px] text-[#4a5568] tracking-widest uppercase mb-2">{label}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className={`text-[11px] mt-1 font-semibold ${up ? "text-green-400" : "text-[#ff4d6d]"}`}>{change} YoY</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="col-span-2 bg-[#0d1117] border border-[#1a2035] rounded-xl p-5">
          <SectionHeader title="Monthly Rebate Performance (9-Month Trend)" />
          <div className="flex items-end gap-2 h-44 mt-4">
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full flex flex-col justify-end rounded-t-sm cursor-pointer group relative"
                  style={{ height: "140px" }}
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {hoveredBar === i && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1a2035] border border-[#2a3350] rounded px-2 py-1 text-[10px] text-white whitespace-nowrap z-10">
                      ${d.rebate}K earned / ${d.recovered}K recovered
                    </div>
                  )}
                  <div
                    className="w-full rounded-t-sm transition-all duration-200"
                    style={{
                      height: `${(d.recovered / maxRebate) * 120}px`,
                      background: "linear-gradient(to top, #0066ff, #00d4ff)",
                      opacity: hoveredBar === null || hoveredBar === i ? 1 : 0.5,
                    }}
                  />
                  <div
                    className="w-full"
                    style={{
                      height: `${(d.disputed / maxRebate) * 120}px`,
                      background: "#ff4d6d",
                      opacity: 0.6,
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#4a5568]">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-gradient-to-r from-[#0066ff] to-[#00d4ff]" />
              <span className="text-[10px] text-[#4a5568]">Recovered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-[#ff4d6d]/60" />
              <span className="text-[10px] text-[#4a5568]">Disputed</span>
            </div>
          </div>
        </div>

        {/* Vendor Breakdown */}
        <div className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-5">
          <SectionHeader title="Rebate by Vendor" />
          <div className="space-y-3 mt-3">
            {vendorBreakdown.map(({ vendor, amount, pct, color }) => (
              <div key={vendor}>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-[#c0c8d8]">{vendor}</span>
                  <span className="text-[10px] font-bold" style={{ color }}>${amount}K</span>
                </div>
                <div className="h-1.5 bg-[#1a2035] rounded-full">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GPO Performance */}
      <div className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-5">
        <SectionHeader title="GPO Performance Scorecard" />
        <table className="w-full text-xs mt-3">
          <thead>
            <tr className="border-b border-[#1a2035]">
              {["GPO", "Active Contracts", "Total Rebates", "Compliance Score", "Trend", "Action"].map(h => (
                <th key={h} className="text-left px-3 py-2 text-[10px] text-[#4a5568] tracking-widest uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gpoPerformance.map(g => (
              <tr key={g.gpo} className="border-b border-[#1a2035]/50 hover:bg-[#0a1628] transition-colors">
                <td className="px-3 py-3 font-bold text-white">{g.gpo}</td>
                <td className="px-3 py-3 text-[#00d4ff]">{g.contracts}</td>
                <td className="px-3 py-3 text-green-400 font-semibold">{g.rebate}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-[#1a2035] rounded-full">
                      <div className="h-full rounded-full bg-green-400" style={{ width: `${g.compliance}%` }} />
                    </div>
                    <span className="text-[10px] text-green-400">{g.compliance}%</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-green-400 font-semibold">{g.trend}</td>
                <td className="px-3 py-3">
                  <button className="px-3 py-1 bg-[#0066ff]/20 border border-[#0066ff]/30 rounded text-[10px] text-[#00d4ff] hover:bg-[#0066ff]/30 transition-colors">
                    Deep Dive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Regulatory Compliance */}
      <div className="bg-[#0d1117] border border-[#1a2035] rounded-xl p-5">
        <SectionHeader title="Regulatory Compliance Dashboard" />
        <div className="grid grid-cols-4 gap-4 mt-3">
          {[
            { label: "340B Compliance", score: 100, status: "Compliant" },
            { label: "Anti-Kickback Statute", score: 100, status: "Compliant" },
            { label: "Stark Law Attestation", score: 98, status: "Minor Gap" },
            { label: "State Price Transparency", score: 95, status: "Review Due" },
          ].map(({ label, score, status }) => (
            <div key={label} className="bg-[#0a1628] border border-[#1a2035] rounded-lg p-3 text-center">
              <div className="text-[10px] text-[#4a5568] tracking-widest uppercase mb-2">{label}</div>
              <div className="text-2xl font-bold text-white">{score}%</div>
              <div className={`text-[10px] mt-1 ${score === 100 ? "text-green-400" : score >= 97 ? "text-yellow-400" : "text-[#ff4d6d]"}`}>
                {status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
