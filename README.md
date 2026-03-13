# Vani — Contract Intelligence Platform

> AI-powered rebate reconciliation, contract operations, and revenue analytics for healthcare GPO & vendor contract management.

Built for **Advocate Health** — Enterprise Language Services & Access / Contract Operations teams.

---

## 🚀 Features

| Module | Description |
|--------|-------------|
| **Command Center** | Real-time KPI dashboard with live agent status and activity feed |
| **Contract Operations** | GPO & vendor contract lifecycle management with AI drill-down |
| **Reconciliation Engine** | EDI 835 payment matching, variance detection, dispute workflows |
| **Revenue Analytics** | Financial performance, GPO scorecards, regulatory compliance |
| **AI Agent Hub** | 7 autonomous agents — ReconcileBot, ComplianceWatcher, DisputeResolver, and more |
| **Opportunity Finder** | AI-detected revenue recovery, tier upgrades, retroactive claims |
| **QA Review Center** | Compliance validation, audit trail, exception management |

---

## 🤖 Vani Agents

- **ReconcileBot Alpha** — EDI 835 parsing, invoice matching, variance detection
- **ContractOptimizer** — Tier modeling, spend gap analysis, rate benchmarking
- **ComplianceWatcher** — 340B eligibility, Anti-Kickback, Stark Law monitoring
- **DisputeResolver** — Root cause analysis, vendor communication, SLA tracking
- **QA Sentinel** — Audit validation, data integrity, exception reporting
- **RevenueHarvester** — Missed rebate detection, retroactive claims, GPO gaps
- **ForecastEngine** — Revenue forecasting, spend modeling, tier projections

---

## 🛠 Tech Stack

- **React 19** + TypeScript
- **Vite** (dev server & build)
- **Tailwind CSS 3.4** (styling)
- **shadcn/ui** (component library)
- **Radix UI** (accessible primitives)
- **Lucide React** (icons)

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/emmkiprono-coder/vani-contract-intelligence.git
cd vani-contract-intelligence

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
pnpm build
pnpm preview
```

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Root app + routing
├── main.tsx                   # Entry point
├── index.css                  # Global styles + Tailwind
├── components/
│   ├── Sidebar.tsx            # Navigation sidebar
│   ├── Header.tsx             # Top header bar
│   ├── Shared.tsx             # Reusable components (StatCard, Badge, AgentPulse)
│   └── ui/                    # shadcn/ui components (40+)
└── pages/
    ├── Dashboard.tsx          # Command Center
    ├── ContractOps.tsx        # Contract Operations
    ├── Reconciliation.tsx     # Rebate Reconciliation + Vani chat
    ├── Analytics.tsx          # Revenue Analytics
    ├── AgentHub.tsx           # AI Agent monitoring
    ├── OpportunityFinder.tsx  # Revenue opportunity detection
    └── QAReview.tsx           # QA & audit management
```

---

## 🔗 Demo Mode

All sections include full interactive demo mode:
- **Drill-down modals** on every table row
- **Executable action buttons** with animated Vani agent responses
- **Live reconciliation runner** with step-by-step progress
- **AI chat interface** in Reconciliation with suggested prompts
- **Audit trail logging** on all executed actions

---

## 🏥 Healthcare Context

Designed for multi-GPO environments (Premier, Vizient, HPG) with support for:
- 340B Drug Pricing Program compliance
- Anti-Kickback Statute monitoring
- Stark Law attestation tracking
- Joint Commission NPG Goals 4 & 7 alignment
- EDI X12 835 remittance processing

---

## 👤 Author

**Emmanuel Chepkwony**  
AVP, Enterprise Language Services & Access  
Advocate Health

GitHub: [@emmkiprono-coder](https://github.com/emmkiprono-coder)

---

*Built with Vani — Contract Intelligence by Anthropic Claude*
