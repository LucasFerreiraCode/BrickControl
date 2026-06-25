import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("premium-card", className)}>
    {children}
  </div>
);

export const Button = ({ 
  children, 
  variant = 'primary', 
  className,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) => {
  const variants = {
    primary: "bg-primary text-white hover:brightness-110 shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    secondary: "bg-white/5 text-white hover:bg-white/10 border border-white/10",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-[0_0_20px_rgba(225,29,72,0.3)]",
    ghost: "bg-transparent text-muted hover:text-white"
  };

  return (
    <button 
      className={cn(
        "px-6 py-3 rounded-2xl font-semibold tracking-wide transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge = ({ children, variant = 'gray' }: { children: React.ReactNode; variant?: 'green' | 'blue' | 'yellow' | 'red' | 'gray' }) => {
  const colors = {
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-primary/10 text-primary border-primary/20",
    yellow: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    red: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    gray: "bg-slate-800/50 text-slate-400 border-slate-700"
  };

  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border", colors[variant])}>
      {children}
    </span>
  );
};

export const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }: { 
  title: string; 
  value: string; 
  icon: React.ElementType; 
  trend?: string;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple'
}) => {
  const iconColors = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-emerald-500 bg-emerald-500/10",
    amber: "text-amber-500 bg-amber-500/10",
    red: "text-rose-500 bg-rose-500/10",
    purple: "text-purple-500 bg-purple-500/10",
  };

  return (
    <Card className="hover:border-primary/20 p-8 group">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
          {trend && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">
                {trend}
              </span>
              <span className="text-[10px] text-muted font-medium uppercase tracking-wider">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={cn("p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6", iconColors[color])}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
      </div>
    </Card>
  );
};
