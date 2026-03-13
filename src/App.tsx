import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import ContractOps from "./pages/ContractOps";
import Reconciliation from "./pages/Reconciliation";
import Analytics from "./pages/Analytics";
import AgentHub from "./pages/AgentHub";
import OpportunityFinder from "./pages/OpportunityFinder";
import QAReview from "./pages/QAReview";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export type PageKey = "dashboard" | "contracts" | "reconciliation" | "analytics" | "agents" | "opportunities" | "qa";

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const pages: Record<PageKey, React.ReactNode> = {
    dashboard: <Dashboard onNavigate={setActivePage} />,
    contracts: <ContractOps />,
    reconciliation: <Reconciliation />,
    analytics: <Analytics />,
    agents: <AgentHub />,
    opportunities: <OpportunityFinder />,
    qa: <QAReview />,
  };

  return (
    <div className="flex h-screen bg-[#0a0d14] text-white overflow-hidden font-mono">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activePage={activePage} />
        <main className="flex-1 overflow-auto p-6">
          {pages[activePage]}
        </main>
      </div>
    </div>
  );
}
