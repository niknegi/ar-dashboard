import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { KPICard } from "./KPICard";
import { AgingChart } from "./AgingChart";
import { TrendChart } from "./TrendChart";
import { DetailTable } from "./DetailTable";
import { FileUploader } from "./FileUploader";
import { useData } from "../context/DataContext";
import { useDataCalculations } from "../hooks/useDataCalculations";

export function Dashboard() {
  const { data, setData } = useData();
  const { enrichedData, kpis, agingData, trendData } =
    useDataCalculations(data);

  return (
    <>
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
    </>
  );
}
