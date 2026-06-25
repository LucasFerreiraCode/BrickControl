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
    <div className={`sidebar-item ${active ? 'active' : ''}`}>
      <Icon size={20} />
      <span className="font-medium">{label}</span>
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
      {/* Mobile Toggle */}
      <button 
        className="fixed top-4 right-4 z-50 p-2 bg-card rounded-lg lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-slate-800 transform transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <TrendingUp className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">BrickTracker</h1>
          </div>

          <nav className="flex-1 space-y-2">
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

          <div className="pt-6 border-t border-slate-800">
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
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
