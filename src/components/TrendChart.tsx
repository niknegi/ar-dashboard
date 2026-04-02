import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TrendData } from "../types";

interface TrendChartProps {
  data: TrendData[];
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
    const date = new Date(label);
    return (
      <div className="bg-surface-container-high/95 backdrop-blur-md p-3 rounded-lg glass-edge">
        <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">
          {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </p>
        <div className="space-y-1">
          <p className="font-label text-xs text-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            AR: {formatCurrency(payload[0].value)}
          </p>
          <p className="font-label text-xs text-tertiary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            AP: {formatCurrency(payload[1].value)}
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="bg-surface-container p-8 rounded-2xl glass-edge relative"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-headline text-xl font-bold">PROJECTION</h3>
          <p className="font-label text-[10px] tracking-widest text-on-surface-variant mt-1 uppercase">
            30 Day Real-time Tracking
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-label text-[10px] text-on-surface-variant uppercase">
              Receivables
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="font-label text-[10px] text-on-surface-variant uppercase">
              Payables
            </span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a4ffb9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a4ffb9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff7168" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff7168" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(69,72,80,0.2)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{
                fill: "#a9abb5",
                fontSize: 10,
                fontFamily: "Space Grotesk",
              }}
              axisLine={{ stroke: "rgba(69,72,80,0.3)" }}
              tickLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              minTickGap={30}
            />
            <YAxis
              tick={{
                fill: "#a9abb5",
                fontSize: 10,
                fontFamily: "Space Grotesk",
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="ar_balance"
              stroke="#a4ffb9"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAR)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#a4ffb9",
                stroke: "#0b0e15",
                strokeWidth: 2,
              }}
            />
            <Area
              type="monotone"
              dataKey="ap_balance"
              stroke="#ff7168"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAP)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#ff7168",
                stroke: "#0b0e15",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
