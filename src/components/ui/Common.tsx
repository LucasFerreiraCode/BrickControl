import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-card border border-slate-800 rounded-2xl p-6 shadow-sm", className)}>
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
    primary: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
    secondary: "bg-white/5 text-white hover:bg-white/10 border border-white/5",
    danger: "bg-danger text-white hover:bg-danger/90 shadow-lg shadow-danger/20",
    ghost: "bg-transparent text-muted hover:text-white"
  };

  return (
    <button 
      className={cn(
        "px-4 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2",
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
    green: "bg-success/10 text-success border-success/20",
    blue: "bg-primary/10 text-primary border-primary/20",
    yellow: "bg-warning/10 text-warning border-warning/20",
    red: "bg-danger/10 text-danger border-danger/20",
    gray: "bg-slate-700/50 text-slate-400 border-slate-700"
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", colors[variant])}>
      {children}
    </span>
  );
};

export const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }: { 
  title: string; 
  value: string; 
  icon: LucideIcon; 
  trend?: string;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple'
}) => {
  const bgColors = {
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    red: "bg-rose-500/10 text-rose-500",
    purple: "bg-purple-500/10 text-purple-500",
  };

  return (
    <Card className="flex flex-col gap-4 card-hover overflow-hidden relative">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
          {trend && (
            <p className="text-xs font-medium text-success flex items-center gap-1">
              {trend}
              <span className="text-muted font-normal">desde o mês passado</span>
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", bgColors[color])}>
          <Icon size={24} />
        </div>
      </div>
      <div className={cn("absolute bottom-0 left-0 h-1 w-full opacity-50", 
        color === 'blue' ? 'bg-blue-500' : 
        color === 'green' ? 'bg-emerald-500' : 
        color === 'amber' ? 'bg-amber-500' : 
        color === 'red' ? 'bg-rose-500' : 'bg-purple-500'
      )} />
    </Card>
  );
};
