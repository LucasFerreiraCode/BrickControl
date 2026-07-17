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
  Menu,
  X,
  TrendingUp,
  Bell,
  Search,
  Brain
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, path, active }: SidebarItemProps) => (
  <Link to={path}>
    <div className={`nav-item ${active ? 'active' : ''}`}>
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      <span className="text-sm tracking-tight">{label}</span>
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_#8B5CF6]" 
        />
      )}
    </div>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Estoque', path: '/inventory' },
    { icon: Wallet, label: 'Financeiro', path: '/finance' },
    { icon: Calculator, label: 'Simulador', path: '/calculator' },
    { icon: Brain, label: 'Consultor IA', path: '/ai-advisor' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
    { icon: Target, label: 'Metas', path: '/goals' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="fixed top-6 right-6 z-[60] p-4 bg-slate-900 border border-white/10 rounded-2xl lg:hidden shadow-2xl active:scale-90 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-background/40 backdrop-blur-3xl border-r border-white/5 transform transition-all duration-700 lg:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-8">
          {/* Logo Area */}
          <div className="flex items-center gap-4 mb-16 px-2 group">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3 group-hover:rotate-12 transition-transform duration-500">
              <TrendingUp className="text-white" size={30} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white leading-none">Electro<span className="text-primary">Control</span></h1>
              <span className="text-[9px] font-black text-muted uppercase tracking-[0.3em] block mt-1">Platform v2.0</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            <p className="px-6 text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-6 opacity-50">Principais</p>
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

          {/* Footer Area */}
          <div className="pt-8 border-t border-white/5">
            <SidebarItem label="Configurações" icon={Settings} path="/settings" active={location.pathname === '/settings'} />
            <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-xs font-bold text-white mb-1">Membro Diamond</p>
                <p className="text-[10px] text-muted mb-4 leading-relaxed font-medium">Você tem acesso total à nossa Inteligência Artificial.</p>
                <Link to="/ai-advisor" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Acessar IA</Link>
              </div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/10 blur-2xl rounded-full" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = () => {
  return (
    <header className="fixed top-0 left-0 lg:left-80 right-0 h-24 z-40 bg-background/20 backdrop-blur-lg border-b border-white/5 flex items-center justify-between px-8 lg:px-12">
      <div className="flex items-center gap-6 max-w-xl w-full">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar aparelhos, transações..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-muted hover:text-white transition-all relative">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-background shadow-[0_0_10px_#8B5CF6]" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-none">Lucas Ferreira</p>
            <p className="text-[9px] text-muted uppercase tracking-widest mt-1">Revendedor Gold</p>
          </div>
          <div className="w-11 h-11 bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl ring-2 ring-primary/20">
            <User className="text-white/40" size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="lg:ml-80 pt-32 pb-12 px-6 lg:px-12 transition-all duration-500 overflow-x-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-[1600px] mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
