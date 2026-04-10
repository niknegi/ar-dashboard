import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, AlertCircle, Clock } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useDataCalculations } from "../hooks/useDataCalculations";
import { getVendorPortalUrl } from "../utils/vendorUrls";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

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

export function VendorDetail() {
  const { vendorName } = useParams<{ vendorName: string }>();
  const { data } = useData();
  const { enrichedData } = useDataCalculations(data);

  const decodedVendor = decodeURIComponent(vendorName || "");
  const portalUrl = getVendorPortalUrl(decodedVendor);

  const vendorInvoices = enrichedData.filter(
    (item) => item.customer_vendor === decodedVendor && item.status !== "Paid"
  );

  const totalPending = vendorInvoices.reduce(
    (sum, item) => sum + (item.amount - item.paid_amount),
    0
  );

  const overdueCount = vendorInvoices.filter((i) => i.status === "Overdue").length;

  return (
    <div>
      {/* Back + Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label text-xs tracking-widest uppercase mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-on-background">
              {decodedVendor}
            </h1>
            <p className="font-label text-xs tracking-[0.2em] text-on-surface-variant mt-2 uppercase">
              Vendor Portal & Pending Invoices
            </p>
          </div>

          {portalUrl && (
            <a
              href={portalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary-container text-on-primary-container rounded-lg font-label text-[11px] tracking-widest font-bold hover:shadow-[0_0_15px_rgba(0,253,135,0.4)] transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              OPEN VENDOR PORTAL
            </a>
          )}
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-surface-container p-6 rounded-xl glass-edge"
        >
          <p className="font-label text-[10px] tracking-[0.3em] text-on-surface-variant uppercase mb-3">
            Total Pending
          </p>
          <div className="text-4xl font-headline font-black text-primary">
            {formatCurrency(totalPending)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-surface-container p-6 rounded-xl glass-edge"
        >
          <p className="font-label text-[10px] tracking-[0.3em] text-on-surface-variant uppercase mb-3">
            Pending Invoices
          </p>
          <div className="text-4xl font-headline font-black text-secondary">
            {vendorInvoices.length}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-surface-container p-6 rounded-xl glass-edge"
        >
          <p className="font-label text-[10px] tracking-[0.3em] text-on-surface-variant uppercase mb-3">
            Overdue Count
          </p>
          <div
            className={`text-4xl font-headline font-black ${
              overdueCount > 0 ? "text-tertiary" : "text-primary"
            }`}
          >
            {overdueCount}
          </div>
        </motion.div>
      </div>

      {/* Pending Invoices Table */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-surface-container-low rounded-2xl overflow-hidden glass-edge shadow-2xl"
      >
        <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container">
          <h3 className="font-headline font-bold text-xl uppercase tracking-tighter">
            Pending Invoices
          </h3>
          {vendorInvoices.length === 0 && (
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
              No pending items
            </span>
          )}
        </div>

        {vendorInvoices.length > 0 ? (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-high/50 font-label text-[9px] tracking-[0.2em] text-on-surface-variant uppercase">
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Outstanding</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Aging Bucket</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Days Overdue</th>
                </tr>
              </thead>
              <tbody className="font-label text-xs">
                {vendorInvoices.map((item, idx) => {
                  const outstanding = item.amount - item.paid_amount;
                  return (
                    <motion.tr
                      key={item.invoice_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors duration-300"
                    >
                      <td className="px-6 py-4 text-on-surface-variant font-mono">
                        {item.invoice_id}
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
                        {formatCurrency(outstanding)}
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
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.days_overdue && item.days_overdue > 0 ? (
                          <span className="inline-flex items-center gap-1 text-tertiary">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {item.days_overdue}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-primary">
                            <Clock className="w-3.5 h-3.5" />
                            0
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-on-surface-variant font-label text-sm">
            No pending invoices for this vendor.
          </div>
        )}
      </motion.div>
    </div>
  );
}
