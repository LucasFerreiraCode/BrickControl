import { useMemo } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus,
  DollarSign,
  CreditCard,
  PiggyBank,
  Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Badge, Button, StatCard } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';
import { AddTransactionModal } from '../components/modals/AddTransactionModal';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Finance = () => {
  const { transactions, stats } = useBricks();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Montar dados do gráfico a partir das transações
  const chartData = useMemo(() => {
    const months: Record<string, { month: string; entradas: number; saidas: number }> = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('pt-BR', { month: 'short' });
      if (!months[key]) months[key] = { month: label, entradas: 0, saidas: 0 };
      if (t.type === 'In') months[key].entradas += t.value;
      else months[key].saidas += t.value;
    });
    return Object.values(months).slice(-6);
  }, [transactions]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
        <div className="space-y-1">
          <Badge variant="blue">Central Financeira</Badge>
          <h1 className="text-6xl font-black tracking-tighter text-white">
            Painel <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Financeiro</span>
          </h1>
          <p className="text-muted text-xl font-medium tracking-tight">Fluxo de caixa, entradas, saídas e controle de capital.</p>
        </div>
        <Button className="px-8" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} strokeWidth={3} />
          Nova Transação
        </Button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Capital Disponível" value={`R$ ${stats.currentCapital.toLocaleString()}`} icon={Wallet} color="blue" />
        <StatCard title="Entradas" value={`R$ ${stats.totalIn.toLocaleString()}`} icon={TrendingUp} color="green" />
        <StatCard title="Saídas" value={`R$ ${stats.totalOut.toLocaleString()}`} icon={TrendingDown} color="red" />
        <StatCard title="Balanço" value={`R$ ${stats.balance.toLocaleString()}`} icon={Activity} color={stats.balance >= 0 ? 'green' : 'red'} />
      </div>

      {/* Gráfico Financeiro */}
      <Card className="p-10 bg-slate-900/40">
        <h3 className="text-2xl font-black text-white tracking-tighter mb-2">Fluxo de Caixa</h3>
        <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-8">Entradas vs Saídas por mês</p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={10} fontWeight={800} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={10} fontWeight={800} tickLine={false} axisLine={false} tickFormatter={v => `R$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="entradas" stroke="#34D399" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" name="Entradas" />
              <Area type="monotone" dataKey="saidas" stroke="#F87171" strokeWidth={3} fillOpacity={1} fill="url(#colorOut)" name="Saídas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Histórico de Transações */}
      <Card className="p-10 bg-slate-900/30 overflow-hidden">
        <h3 className="text-2xl font-black text-white tracking-tighter mb-8">Histórico de Transações</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted">Data</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted">Descrição</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted">Tipo</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.length > 0 ? transactions.slice(0, 15).map(t => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 text-sm text-muted font-bold">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className="py-5 text-sm text-white font-bold">{t.description}</td>
                  <td className="py-5">
                    <Badge variant={t.type === 'In' ? 'green' : 'red'}>
                      <span className="flex items-center gap-1">
                        {t.type === 'In' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {t.type === 'In' ? 'Entrada' : 'Saída'}
                      </span>
                    </Badge>
                  </td>
                  <td className={`py-5 text-right text-sm font-black ${t.type === 'In' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'In' ? '+' : '-'} R$ {t.value.toLocaleString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-muted font-bold uppercase tracking-widest opacity-30">Nenhuma transação registrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </motion.div>
  );
};

export default Finance;
