import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { AgingBucket } from "../types";

interface AgingChartProps {
  data: AgingBucket[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-high/95 backdrop-blur-md p-3 rounded-lg glass-edge">
        <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((p: any) => (
            <p
              key={p.dataKey}
              className="font-label text-xs flex items-center gap-2"
              style={{ color: p.color }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              {p.name}: {formatCurrency(p.value)}
            </p>
          ))}
          <p className="font-label text-[10px] text-on-surface-variant mt-1 pt-1 border-t border-outline-variant/20">
            Count:{" "}
            {payload[0]?.payload?.count + (payload[1]?.payload?.count ?? 0)}{" "}
            invoices
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export function AgingChart({ data }: AgingChartProps) {
  const arTotal = data.reduce((s, d) => s + d.ar_amount, 0);
  const apTotal = data.reduce((s, d) => s + d.ap_amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="bg-surface-container p-8 rounded-2xl glass-edge"
    >
      <h3 className="font-headline text-xl font-bold mb-6">AGING</h3>

      <div className="space-y-8">
        {/* AR Stack */}
        <div>
          <div className="flex justify-between mb-3 items-end">
            <span className="font-label text-[10px] tracking-widest text-primary uppercase">
              Receivables
            </span>
            <span className="font-headline font-bold text-sm">
              {formatCurrency(arTotal)}
            </span>
          </div>
          <div className="h-10 flex w-full rounded-lg overflow-hidden bg-surface-container-high gap-0.5 p-0.5">
            {data.map((d, i) => {
              const pct = arTotal > 0 ? (d.ar_amount / arTotal) * 100 : 0;
              return (
                <motion.div
                  key={d.bucket}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`h-full transition-opacity hover:opacity-80 ${i === 0 ? "bg-primary glow-emerald" : `bg-primary/${[60, 30, 10][i] || 10}`}`}
                  title={`${d.bucket}: ${formatCurrency(d.ar_amount)}`}
                />
              );
            })}
          </div>
        </div>

        {/* AP Stack */}
        <div>
          <div className="flex justify-between mb-3 items-end">
            <span className="font-label text-[10px] tracking-widest text-tertiary uppercase">
              Payables
            </span>
            <span className="font-headline font-bold text-sm">
              {formatCurrency(apTotal)}
            </span>
          </div>
          <div className="h-10 flex w-full rounded-lg overflow-hidden bg-surface-container-high gap-0.5 p-0.5">
            {data.map((d, i) => {
              const pct = apTotal > 0 ? (d.ap_amount / apTotal) * 100 : 0;
              return (
                <motion.div
                  key={d.bucket}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1 + 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`h-full transition-opacity hover:opacity-80 ${i === 0 ? "bg-tertiary glow-ruby" : `bg-tertiary/${[60, 30, 10][i] || 10}`}`}
                  title={`${d.bucket}: ${formatCurrency(d.ap_amount)}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 grid grid-cols-4 gap-2 text-center">
        {["Current", "1-30d", "31-60d", "60d+"].map((label, i) => (
          <div key={label}>
            <span className="block text-[8px] font-label text-on-surface-variant uppercase">
              {label}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block mt-1 ${i === 0 ? "bg-outline-variant" : `bg-outline-variant/${[60, 30, 10][i]}`}`}
            />
          </div>
        ))}
      </div>

      {/* Small BarChart as backup visual */}
      <div className="h-40 mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(69,72,80,0.2)"
              vertical={false}
            />
            <XAxis
              dataKey="bucket"
              tick={{
                fill: "#a9abb5",
                fontSize: 9,
                fontFamily: "Space Grotesk",
              }}
              axisLine={{ stroke: "rgba(69,72,80,0.3)" }}
              tickLine={false}
            />
            <YAxis
              tick={{
                fill: "#a9abb5",
                fontSize: 9,
                fontFamily: "Space Grotesk",
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="ar_amount" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={`ar-${i}`} fill="#a4ffb9" />
              ))}
            </Bar>
            <Bar dataKey="ap_amount" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={`ap-${i}`} fill="#ff7168" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
