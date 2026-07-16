import React, { useState, useMemo } from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  CreditCard,
  Search,
  Download,
  Calendar,
  Filter,
  Plus,
  Package
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, Button, Badge } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';
import { AddTransactionModal } from '../components/modals/AddTransactionModal';
import { motion, AnimatePresence } from 'framer-motion';

const Finance = () => {
  const { transactions, bricks, stats } = useBricks();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);

  const chartData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return {
        month: d.toLocaleString('pt-BR', { month: 'short' }),
        monthNum: d.getMonth(),
        year: d.getFullYear(),
        in: 0,
        out: 0
      };
    });

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const monthIdx = last6Months.findIndex(m => m.monthNum === tDate.getMonth() && m.year === tDate.getFullYear());
      if (monthIdx !== -1) {
        if (t.type === 'In') last6Months[monthIdx].in += t.value;
        else last6Months[monthIdx].out += t.value;
      }
    });

    return last6Months;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    const inStock = bricks.filter(b => b.status !== 'Sold');
    if (inStock.length === 0) return [];
    
    inStock.forEach(b => {
      cats[b.category] = (cats[b.category] || 0) + 1;
    });

    return Object.entries(cats).map(([name, count]) => ({
      label: name,
      value: Math.round((count / inStock.length) * 100),
      color: name === 'Eletrônicos' ? 'bg-primary' : name === 'Games' ? 'bg-emerald-500' : 'bg-amber-500'
    })).sort((a, b) => b.value - a.value);
  }, [bricks]);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <Badge variant="blue">Gestão de Capital</Badge>
          <h1 className="text-6xl font-black tracking-tighter text-white">
            Saúde <span className="text-primary italic">Financeira</span>
          </h1>
          <p className="text-muted text-xl font-medium tracking-tight">Acompanhe seu fluxo de caixa e rentabilidade histórica.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="px-8 h-16">
            <Download size={20} />
            Exportar
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="px-8 h-16">
            <Plus size={20} strokeWidth={3} />
            Novo Lançamento
          </Button>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Saldo Total', value: `R$ ${stats.balance.toLocaleString()}`, icon: Wallet, color: 'text-primary', bg: 'bg-primary/10' },
          { title: 'Entradas', value: `R$ ${stats.totalIn.toLocaleString()}`, icon: ArrowUpCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { title: 'Saídas', value: `R$ ${stats.totalOut.toLocaleString()}`, icon: ArrowDownCircle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { title: 'Estoque Ativo', value: `R$ ${stats.workingCapital.toLocaleString()}`, icon: CreditCard, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        ].map((item, i) => (
          <Card key={i} className="flex items-center gap-6 p-8 group">
            <div className={`p-4 rounded-2xl ${item.bg} ${item.color} border border-white/5 shadow-xl transition-transform group-hover:scale-110`}>
              <item.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">{item.title}</p>
              <h4 className="text-2xl font-black text-white tracking-tighter leading-none">{item.value}</h4>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cash Flow Analysis */}
        <Card className="lg:col-span-8 p-10 bg-slate-900/30">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tighter mb-1">Fluxo de Caixa</h3>
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Desempenho Semestral</p>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-primary rounded-lg">Visão Gráfica</button>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} fontWeight={800} tickLine={false} axisLine={false} tick={{dy: 10}} />
                <YAxis stroke="#64748b" fontSize={10} fontWeight={800} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip 
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  itemStyle={{ fontWeight: 700 }}
                />
                <Bar dataKey="in" name="Entradas" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="out" name="Saídas" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categories Analysis */}
        <Card className="lg:col-span-4 p-10 bg-slate-900/40">
          <h3 className="text-2xl font-black text-white tracking-tighter mb-8">Alocação</h3>
          <div className="space-y-8">
            {categoryData.length > 0 ? categoryData.map((cat) => (
              <div key={cat.label} className="group">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-black text-white uppercase tracking-tighter">{cat.label}</span>
                  <span className="text-[11px] font-black text-muted tracking-widest">{cat.value}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.value}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={`h-full ${cat.color} rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)]`} 
                  />
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-muted mb-4 opacity-30">
                  <Package size={32} />
                </div>
                <p className="text-xs font-black text-muted uppercase tracking-widest leading-relaxed">Nenhum investimento disponível para análise.</p>
              </div>
            )}
          </div>
          
          <div className="mt-12 p-6 bg-primary/5 rounded-[2rem] border border-primary/10 relative overflow-hidden group">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Insight de Portfólio</p>
            <p className="text-xs font-bold text-slate-300 leading-relaxed relative z-10">
              Você detém <span className="text-white font-black">R$ {stats.workingCapital.toLocaleString()}</span> alocados em {stats.stockProducts} ativos de alta liquidez.
            </p>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/10 blur-2xl rounded-full" />
          </div>
        </Card>
      </div>

      {/* History Area */}
      <Card className="p-10 bg-slate-900/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tighter leading-none">Extrato Recente</h3>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-2">Histórico completo de transações</p>
          </div>
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar no histórico..." 
              className="premium-input w-full py-3"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Data</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Transação</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Descrição</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode='popLayout'>
                {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
                  <motion.tr 
                    key={t.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                        <Calendar size={14} className="text-primary" />
                        {(() => {
                          const d = new Date(t.date);
                          return isNaN(d.getTime()) ? 'Data Inválida' : d.toLocaleDateString('pt-BR');
                        })()}
                      </div>
                    </td>
                    <td className="py-6">
                      <Badge variant={t.type === 'In' ? 'green' : 'red'}>
                        {t.type === 'In' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </td>
                    <td className="py-6 text-lg font-black text-white tracking-tight">{t.description}</td>
                    <td className={`py-6 text-right font-black text-xl ${t.type === 'In' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'In' ? '+' : '-'} R$ {t.value.toLocaleString()}
                    </td>
                  </motion.tr>
                )) : (
                  <tr className="border-none">
                    <td colSpan={4} className="py-20 text-center text-muted font-black uppercase tracking-widest opacity-20">Nenhuma transação registrada.</td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Finance;
