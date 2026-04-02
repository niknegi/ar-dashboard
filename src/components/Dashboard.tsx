import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Settings,
  Plus,
  Download,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { KPICard } from "./KPICard";
import { AgingChart } from "./AgingChart";
import { TrendChart } from "./TrendChart";
import { DetailTable } from "./DetailTable";
import { FileUploader } from "./FileUploader";
import { useDataCalculations } from "../hooks/useDataCalculations";
import { generateDummyData, exportDummyDataToExcel } from "../data/dummyData";
import type { InvoiceData } from "../types";

const navLinks = [
  { label: "Dashboard", active: true },
  { label: "Portfolio", active: false },
  // { label: "Liquidity", active: false },
  { label: "Risk", active: false },
];

const sideLinks = [
  { icon: "dashboard", label: "Dashboard", active: false },
  { icon: "payments", label: "Accounts Receivable", active: true },
  { icon: "account_balance_wallet", label: "Accounts Payable", active: false },
  { icon: "trending_up", label: "Cash Flow", active: false },
  { icon: "history", label: "Audit Log", active: false },
];

export function Dashboard() {
  const [data, setData] = useState<InvoiceData[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { enrichedData, kpis, agingData, trendData } =
    useDataCalculations(data);

  useEffect(() => {
    setData(generateDummyData(80));
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* TopNav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex justify-between items-center px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4 lg:gap-8">
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-background/70 hover:text-primary transition-all"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <span className="text-2xl font-black tracking-tighter text-primary drop-shadow-[0_0_8px_rgba(164,255,185,0.4)] font-headline">
            Eagle view
          </span>
          <div className="hidden md:flex gap-6 font-headline tracking-tight items-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href="#"
                className={`transition-all duration-300 ${
                  link.active
                    ? "text-primary border-b-2 border-primary-container pb-1"
                    : "text-on-background/60 hover:text-primary hover:drop-shadow-[0_0_5px_rgba(164,255,185,0.5)]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-background/60 hover:text-primary transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-on-background/60 hover:text-primary transition-all">
            <Settings className="w-5 h-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant overflow-hidden">
            <span className="text-xs font-label text-primary font-bold">
              AN
            </span>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`hidden lg:flex flex-col py-24 fixed left-0 top-0 z-40 bg-background shadow-[10px_0_30px_rgba(0,0,0,0.5)] gap-2 h-screen transition-all duration-300 ${
          sidebarOpen ? "w-64 px-4" : "w-16 px-2"
        }`}
      >
        <div className={`mb-8 ${sidebarOpen ? "px-4" : "px-1"}`}>
          <div
            className={`flex items-center gap-2 mb-1 ${!sidebarOpen && "justify-center"}`}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-emerald"></span>
            {sidebarOpen && (
              <span className="font-label uppercase tracking-widest text-[10px] text-primary">
                CYBER_CORE
              </span>
            )}
          </div>
          {sidebarOpen && (
            <span className="font-label uppercase tracking-widest text-[9px] text-on-surface-variant">
              Active Nodes: {enrichedData.length || 0}
            </span>
          )}
        </div>
        <nav className="flex flex-col gap-1">
          {sideLinks.map((link) => (
            <a
              key={link.label}
              href="#"
              title={link.label}
              className={`flex items-center rounded-lg transition-colors duration-300 group ${
                sidebarOpen ? "gap-3 px-4 py-3" : "justify-center px-2 py-3"
              } ${
                link.active
                  ? "bg-primary-container/10 text-primary border-r-4 border-primary-container shadow-[0_0_15px_rgba(0,253,135,0.2)]"
                  : "text-on-background/40 hover:bg-secondary/5 hover:text-on-background"
              }`}
            >
              <span className="text-sm font-label shrink-0">
                {link.icon.charAt(0).toUpperCase()}
              </span>
              {sidebarOpen && (
                <span className="font-label uppercase tracking-widest text-[10px] whitespace-nowrap overflow-hidden">
                  {link.label}
                </span>
              )}
            </a>
          ))}
        </nav>
        <div
          className={`mt-auto pt-4 border-t border-outline-variant/20 flex flex-col gap-4 ${sidebarOpen ? "px-4" : "px-1"}`}
        >
          <button
            onClick={exportDummyDataToExcel}
            title="Export data"
            className={`bg-primary-container text-on-primary-container font-label text-[10px] py-3 rounded tracking-widest font-bold hover:shadow-[0_0_15px_rgba(0,253,135,0.4)] transition-all flex items-center justify-center ${sidebarOpen ? "gap-2" : ""}`}
          >
            <Download className="w-4 h-4 shrink-0" />
            {sidebarOpen && "EXPORT_DATA"}
          </button>
          <div className="flex flex-col gap-2">
            <a
              className={`flex items-center text-on-background/40 hover:text-secondary text-[10px] font-label tracking-widest transition-colors ${sidebarOpen ? "gap-3" : "justify-center"}`}
              href="#"
              title="Support"
            >
              {sidebarOpen && "SUPPORT"}
            </a>
            <a
              className={`flex items-center text-on-background/40 hover:text-secondary text-[10px] font-label tracking-widest transition-colors ${sidebarOpen ? "gap-3" : "justify-center"}`}
              href="#"
              title="Terminal"
            >
              {sidebarOpen && "TERMINAL"}
            </a>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main
        className={`pt-24 px-6 lg:px-8 pb-12 min-h-screen transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}
      >
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-on-background"
            >
              Dashboard
            </motion.h1>
            <p className="font-label text-xs tracking-[0.2em] text-on-surface-variant mt-2 uppercase">
              Real-time AR/AP Synthesis & Flow Projection
            </p>
          </div>
          <div className="flex items-center gap-3 p-2 bg-surface-container-low rounded-lg glass-edge">
            <div className="flex items-center gap-2 px-3 border-r border-outline-variant/30">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-emerald"></span>
              <span className="font-label text-[10px] tracking-widest text-primary">
                SYNC_OK
              </span>
            </div>
            <div className="flex items-center gap-2 px-3">
              <span className="font-label text-[10px] tracking-widest text-on-surface-variant">
                {
                  new Date()
                    .toLocaleTimeString("en-US", {
                      hour12: false,
                      timeZoneName: "short",
                    })
                    .split(" ")[0]
                }{" "}
                GMT
              </span>
            </div>
            <FileUploader onDataLoaded={setData} />
          </div>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          <KPICard
            title="Days Sales Outstanding"
            value={kpis.dso}
            unit="days"
            trend={kpis.trends.dsoChange}
            trendUpIsGood={false}
            color="primary"
            icon="timer"
          />
          <KPICard
            title="Days Payable Outstanding"
            value={kpis.dpo}
            unit="days"
            trend={kpis.trends.dpoChange}
            trendUpIsGood={true}
            color="secondary"
            icon="wallet"
          />
          <KPICard
            title="Collection Efficiency"
            value={kpis.collectionEfficiency}
            unit="%"
            trend={kpis.trends.collectionChange}
            trendUpIsGood={true}
            color="primary-container"
            icon="check"
            progress={kpis.collectionEfficiency}
          />
          <KPICard
            title="Deficit Alert Ratio"
            value={kpis.overduePercent}
            unit="%"
            trend={kpis.trends.overdueChange}
            trendUpIsGood={false}
            color="tertiary"
            icon="alert"
            progress={kpis.overduePercent}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-10">
          <div className="xl:col-span-3">
            <TrendChart data={trendData} />
          </div>
          <div className="xl:col-span-2">
            <AgingChart data={agingData} />
          </div>
        </div>

        {/* Table */}
        <DetailTable data={enrichedData} />
      </main>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-[0_0_20px_rgba(0,253,135,0.4)] flex items-center justify-center z-50 group"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        <div className="absolute right-full mr-4 bg-surface-container-highest px-3 py-1.5 rounded glass-edge whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-label text-[10px] tracking-widest uppercase">
          New_Transaction
        </div>
      </motion.button>
    </div>
  );
}
