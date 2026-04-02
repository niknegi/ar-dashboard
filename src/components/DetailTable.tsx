import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MoreVertical } from "lucide-react";
import type { InvoiceData } from "../types";

interface DetailTableProps {
  data: InvoiceData[];
}

const ITEMS_PER_PAGE = 10;

function getStatusStyle(status: string) {
  switch (status) {
    case "Paid":
      return "bg-primary/10 text-primary border border-primary/20";
    case "Current":
      return "bg-secondary/10 text-secondary border border-secondary/20";
    case "Overdue":
      return "bg-tertiary/10 text-tertiary border border-tertiary/40 shadow-[0_0_10px_rgba(255,113,104,0.15)]";
    default:
      return "bg-surface-container-high text-on-surface-variant border border-outline-variant/20";
  }
}

function getBucketColor(bucket?: string) {
  switch (bucket) {
    case "Current":
      return "text-primary";
    case "1-30 Days":
      return "text-secondary";
    case "31-60 Days":
      return "text-tertiary/80";
    case "60+ Days":
      return "text-tertiary";
    default:
      return "text-on-surface-variant";
  }
}

export function DetailTable({ data }: DetailTableProps) {
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "AR" | "AP">("ALL");
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.customer_vendor.toLowerCase().includes(filter.toLowerCase()) ||
        item.invoice_id.toLowerCase().includes(filter.toLowerCase());
      const matchesType = typeFilter === "ALL" || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [data, filter, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ITEMS_PER_PAGE),
  );
  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="bg-surface-container-low rounded-2xl overflow-hidden glass-edge shadow-2xl"
    >
      <div className="px-6 py-5 border-b border-outline-variant/20 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-surface-container">
        <h3 className="font-headline font-bold text-xl uppercase tracking-tighter">
          Transaction
        </h3>
        <div className="flex gap-2">
          <div className="relative group">
            <input
              type="text"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              placeholder="SEARCH_LEDGER..."
              className="bg-surface-container-highest border-none rounded font-label text-[11px] tracking-widest pl-9 pr-4 py-2.5 w-48 sm:w-64 focus:ring-1 focus:ring-secondary text-on-surface placeholder:text-on-surface-variant/50 transition-all outline-none"
            />
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-on-surface-variant" />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as any);
              setPage(1);
            }}
            className="bg-surface-container-highest border-none rounded font-label text-[11px] tracking-widest px-3 py-2.5 focus:ring-1 focus:ring-secondary text-on-surface outline-none cursor-pointer"
          >
            <option value="ALL">ALL</option>
            <option value="AR">AR</option>
            <option value="AP">AP</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-high/50 font-label text-[9px] tracking-[0.2em] text-on-surface-variant uppercase">
              <th className="px-6 py-4">Node_ID</th>
              <th className="px-6 py-4">Counterparty</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Volume</th>
              <th className="px-6 py-4">Maturity_Date</th>
              <th className="px-6 py-4">Bucket</th>
              <th className="px-6 py-4">Status_Key</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="font-label text-xs">
            {paginatedData.map((item, idx) => {
              const outstanding = item.amount - item.paid_amount;
              return (
                <motion.tr
                  key={item.invoice_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors duration-300 group"
                >
                  <td className="px-6 py-4 text-on-surface-variant font-mono">
                    {item.invoice_id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-surface-container-highest flex items-center justify-center text-[10px] text-on-surface-variant">
                        {item.customer_vendor.charAt(0)}
                      </div>
                      <span
                        className={`font-bold ${item.status === "Overdue" ? "text-tertiary" : "text-on-surface"}`}
                      >
                        {item.customer_vendor}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full tracking-widest uppercase ${
                        item.type === "AR"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-tertiary/10 text-tertiary border border-tertiary/20"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-headline font-bold text-on-surface">
                    $
                    {outstanding.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    {new Date(item.due_date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <span className={getBucketColor(item.aging_bucket)}>
                      {item.aging_bucket}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[9px] tracking-widest uppercase font-bold ${getStatusStyle(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-on-surface-variant group-hover:text-primary transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant font-label text-sm">
          No records found matching your criteria
        </div>
      )}

      <div className="px-6 py-4 bg-surface-container/50 flex justify-between items-center">
        <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
          Showing{" "}
          {filteredData.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0} -{" "}
          {Math.min(page * ITEMS_PER_PAGE, filteredData.length)} of{" "}
          {filteredData.length} nodes
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center hover:bg-primary/20 disabled:opacity-30 disabled:hover:bg-surface-container-highest transition-all"
          >
            <span className="text-sm">←</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(0, 5)
            .map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded flex items-center justify-center font-label text-[10px] font-bold transition-all ${
                  p === page
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-surface-container-highest hover:bg-primary/20"
                }`}
              >
                {p}
              </button>
            ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center hover:bg-primary/20 disabled:opacity-30 disabled:hover:bg-surface-container-highest transition-all"
          >
            <span className="text-sm">→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
