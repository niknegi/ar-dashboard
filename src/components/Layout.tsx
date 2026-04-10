import { useState } from "react";
import {
  Bell,
  Settings,
  Download,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { Outlet, Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const navLinks = [
  { label: "Dashboard", to: "/", active: true },
  { label: "Portfolio", to: "#", active: false },
  { label: "Risk", to: "#", active: false },
];

const sideLinks = [
  { icon: "D", label: "Dashboard", to: "/", active: false },
  { icon: "A", label: "Accounts Receivable", to: "/", active: true },
  { icon: "A", label: "Accounts Payable", to: "/", active: false },
  { icon: "C", label: "Cash Flow", to: "#", active: false },
  { icon: "A", label: "Audit Log", to: "#", active: false },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { exportData } = useData();

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
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-primary drop-shadow-[0_0_8px_rgba(164,255,185,0.4)] font-headline"
          >
            NEON_LEDGER
          </Link>
          <div className="hidden md:flex gap-6 font-headline tracking-tight items-center">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`transition-all duration-300 ${
                  link.active
                    ? "text-primary border-b-2 border-primary-container pb-1"
                    : "text-on-background/60 hover:text-primary hover:drop-shadow-[0_0_5px_rgba(164,255,185,0.5)]"
                }`}
              >
                {link.label}
              </Link>
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
            <span className="text-xs font-label text-primary font-bold">AN</span>
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
            className={`flex items-center gap-2 mb-1 ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-emerald"></span>
            {sidebarOpen && (
              <span className="font-label uppercase tracking-widest text-[10px] text-primary">
                CYBER_CORE
              </span>
            )}
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {sideLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              title={link.label}
              className={`flex items-center rounded-lg transition-colors duration-300 group ${
                sidebarOpen ? "gap-3 px-4 py-3" : "justify-center px-2 py-3"
              } ${
                link.active
                  ? "bg-primary-container/10 text-primary border-r-4 border-primary-container shadow-[0_0_15px_rgba(0,253,135,0.2)]"
                  : "text-on-background/40 hover:bg-secondary/5 hover:text-on-background"
              }`}
            >
              <span className="text-sm font-label shrink-0">{link.icon}</span>
              {sidebarOpen && (
                <span className="font-label uppercase tracking-widest text-[10px] whitespace-nowrap overflow-hidden">
                  {link.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div
          className={`mt-auto pt-4 border-t border-outline-variant/20 flex flex-col gap-4 ${
            sidebarOpen ? "px-4" : "px-1"
          }`}
        >
          <button
            onClick={exportData}
            title="Export data"
            className={`bg-primary-container text-on-primary-container font-label text-[10px] py-3 rounded tracking-widest font-bold hover:shadow-[0_0_15px_rgba(0,253,135,0.4)] transition-all flex items-center justify-center ${
              sidebarOpen ? "gap-2" : ""
            }`}
          >
            <Download className="w-4 h-4 shrink-0" />
            {sidebarOpen && "EXPORT_DATA"}
          </button>
          <div className="flex flex-col gap-2">
            <a
              className={`flex items-center text-on-background/40 hover:text-secondary text-[10px] font-label tracking-widest transition-colors ${
                sidebarOpen ? "gap-3" : "justify-center"
              }`}
              href="#"
              title="Support"
            >
              {sidebarOpen && "SUPPORT"}
            </a>
            <a
              className={`flex items-center text-on-background/40 hover:text-secondary text-[10px] font-label tracking-widest transition-colors ${
                sidebarOpen ? "gap-3" : "justify-center"
              }`}
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
        className={`pt-24 px-6 lg:px-8 pb-12 min-h-screen transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
