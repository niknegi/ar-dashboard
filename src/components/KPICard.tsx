import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Timer, Wallet, CheckCircle, AlertTriangle } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  unit: string;
  trend: number;
  trendUpIsGood: boolean;
  color: 'primary' | 'secondary' | 'primary-container' | 'tertiary';
  icon?: 'timer' | 'wallet' | 'check' | 'alert';
  progress?: number;
}

const colorMap = {
  primary: {
    bg: 'bg-primary/5',
    hover: 'hover:bg-primary/10',
    text: 'text-primary',
    sub: 'text-primary/60',
    glow: 'glow-emerald',
    pulse: 'animate-pulse-emerald',
    bar: 'bg-primary',
  },
  'primary-container': {
    bg: 'bg-primary-container/5',
    hover: 'hover:bg-primary-container/10',
    text: 'text-primary-container',
    sub: 'text-primary-container/60',
    glow: 'glow-emerald',
    pulse: '',
    bar: 'bg-primary-container',
  },
  secondary: {
    bg: 'bg-secondary/5',
    hover: 'hover:bg-secondary/10',
    text: 'text-secondary',
    sub: 'text-secondary/60',
    glow: 'glow-sapphire',
    pulse: '',
    bar: 'bg-secondary',
  },
  tertiary: {
    bg: 'bg-tertiary/5',
    hover: 'hover:bg-tertiary/10',
    text: 'text-tertiary',
    sub: 'text-tertiary/60',
    glow: 'glow-ruby',
    pulse: 'animate-pulse-ruby',
    bar: 'bg-tertiary',
  },
};

const icons = {
  timer: Timer,
  wallet: Wallet,
  check: CheckCircle,
  alert: AlertTriangle,
};

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-5xl font-headline font-black"
    >
      {value.toLocaleString('en-US', { minimumFractionDigits: value % 1 !== 0 ? 1 : 0, maximumFractionDigits: 1 })}
    </motion.span>
  );
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  trendUpIsGood,
  color,
  icon = 'timer',
  progress,
}: KPICardProps) {
  const styles = colorMap[color];
  const isPositiveTrend = trend > 0;
  const isGood = isPositiveTrend === trendUpIsGood;
  const Icon = icons[icon];
  const trendColor = isGood ? 'text-primary' : 'text-tertiary';
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }}
      className={`${styles.bg} ${styles.hover} p-6 rounded-xl glass-edge relative overflow-hidden group transition-colors duration-300`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Icon className="w-10 h-10" />
      </div>
      <p className="font-label text-[10px] tracking-[0.3em] text-on-surface-variant uppercase mb-4">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className={`${styles.text} ${styles.pulse}`}>
          <AnimatedNumber value={value} />
        </span>
        <span className={`font-label text-xs ${styles.sub}`}>{unit}</span>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className={`flex items-center gap-1 ${trendColor} text-xs font-label`}>
          <TrendIcon className="w-4 h-4" />
          <span>{trend > 0 ? '+' : ''}{trend}%</span>
        </div>
        <div className="h-[2px] w-24 bg-surface-container-highest relative rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress ?? Math.min(Math.max((value / (unit === 'days' ? 60 : 100)) * 100, 100), 100)}%` }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-0 ${styles.bar} rounded-full ${styles.glow}`}
          />
        </div>
      </div>
    </motion.div>
  );
}
