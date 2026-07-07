import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, HTMLMotionProps } from 'framer-motion';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={cn("glass-card p-6", className)}
  >
    {children}
  </motion.div>
);

export const Button = ({ 
  children, 
  variant = 'primary', 
  className,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "bg-rose-600/20 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white",
    ghost: "btn-ghost"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "premium-button",
        variants[variant],
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

export const Badge = ({ children, variant = 'gray' }: { children: React.ReactNode; variant?: 'green' | 'blue' | 'yellow' | 'red' | 'gray' }) => {
  const colors = {
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    blue: "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]",
    yellow: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    red: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
    gray: "bg-slate-800/50 text-slate-400 border-slate-700"
  };

  return (
    <span className={cn("badge", colors[variant])}>
      {children}
    </span>
  );
};

export const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  trend?: string;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple'
}) => {
  const iconColors = {
    blue: "text-primary bg-primary/10 border-primary/20",
    green: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    red: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };

  return (
    <Card className="group">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted leading-none">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black tracking-tighter text-white leading-none">{value}</h3>
          </div>
          {trend && (
            <div className="flex items-center gap-1.5 mt-4">
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                {trend}
              </span>
              <span className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-60">Mensal</span>
            </div>
          )}
        </div>
        <div className={cn("p-4 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl", iconColors[color])}>
          <Icon size={28} strokeWidth={2.5} />
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </Card>
  );
};
