import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Wallet, 
  BarChart3, 
  Target, 
  User, 
  Settings, 
  Calculator,
  ChevronRight,
  Menu,
  X,
  TrendingUp
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, path, active }: SidebarItemProps) => (
  <Link to={path}>
    <div className={`sidebar-item ${active ? 'active' : ''} group`}>
      <Icon size={20} className={active ? 'text-white' : 'text-muted group-hover:text-white'} />
      <span className="font-semibold tracking-wide">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
    </div>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Meus Bricks', path: '/inventory' },
    { icon: Wallet, label: 'Financeiro', path: '/finance' },
    { icon: Calculator, label: 'Calculadora', path: '/calculator' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
    { icon: Target, label: 'Metas', path: '/goals' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  return (
    <>
      <button 
        className="fixed top-6 right-6 z-50 p-3 bg-card border border-card-border rounded-2xl lg:hidden shadow-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={max(24)} /> : <Menu size={24} />}
      </button>

      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-background border-r border-card-border transform transition-all duration-500 lg:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.8)]' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center gap-4 mb-12 px-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 rotate-3">
              <TrendingUp className="text-white" size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tighter text-white leading-none">BrickTracker</h1>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Premium SaaS</span>
            </div>
          </div>

          <nav className="flex-1 space-y-3">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                active={location.pathname === item.path}
              />
            ))}
          </nav>

          <div className="pt-8 border-t border-card-border">
            <SidebarItem label="Configurações" icon={Settings} path="/settings" active={location.pathname === '/settings'} />
          </div>
        </div>
      </div>
    </>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 lg:ml-72 p-6 lg:p-12 transition-all duration-500">
        <div className="max-w-7xl mx-auto space-y-12">
          {children}
        </div>
      </main>
    </div>
  );
};

function max(n: number) { return n; }
