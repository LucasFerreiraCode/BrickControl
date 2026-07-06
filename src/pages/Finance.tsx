import React, { useState, useMemo } from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  CreditCard,
  Search,
  Download,
  Calendar
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

const Finance = () => {
  const { transactions, bricks, stats } = useBricks();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);

  // Derive chart data from transactions
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

  // Category Distribution
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
      color: name === 'Eletrônicos' ? 'bg-primary' : name === 'Games' ? 'bg-success' : 'bg-amber-500'
    })).sort((a, b) => b.value - a.value);
  }, [bricks]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Financeiro</h2>
          <p className="text-muted">Controle total sobre seu fluxo de caixa e capital disponível.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Download size={20} />
            Exportar
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>Novo Lançamento</Button>
        </div>
      </header>

      {/* Financial Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Saldo em Caixa', value: `R$ ${stats.balance.toLocaleString()}`, icon: Wallet, color: 'text-primary' },
          { title: 'Entradas Totais', value: `R$ ${stats.totalIn.toLocaleString()}`, icon: ArrowUpCircle, color: 'text-success' },
          { title: 'Saídas Totais', value: `R$ ${stats.totalOut.toLocaleString()}`, icon: ArrowDownCircle, color: 'text-danger' },
          { title: 'Capital Alocado', value: `R$ ${stats.workingCapital.toLocaleString()}`, icon: CreditCard, color: 'text-amber-500' },
        ].map((item, i) => (
          <Card key={i} className="flex items-center gap-4 border-slate-800">
            <div className={`p-3 rounded-2xl bg-white/5 ${item.color}`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted">{item.title}</p>
              <h4 className="text-xl font-bold text-white">{item.value}</h4>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cash Flow Chart */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Fluxo de Caixa (Últimos 6 meses)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip 
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="in" name="Entradas" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="out" name="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categories / Insights */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Estoque por Categoria</h3>
          <div className="space-y-6">
            {categoryData.length > 0 ? categoryData.map((cat) => (
              <div key={cat.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white font-medium">{cat.label}</span>
                  <span className="text-muted">{cat.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.value}%` }} />
                </div>
              </div>
            )) : (
              <p className="text-center text-muted py-10 text-sm">Nenhum produto em estoque.</p>
            )}
          </div>
          <div className="mt-10 p-4 bg-white/5 rounded-xl border border-white/5 text-center">
            <p className="text-xs text-muted leading-relaxed">
              Você possui <strong>R$ {stats.workingCapital.toLocaleString()}</strong> investidos em {stats.stockProducts} produtos no momento.
            </p>
          </div>
        </Card>
      </div>

      {/* Transaction List */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-white">Últimas Transações</h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Buscar histórico..." 
              className="w-full bg-white/5 border border-slate-800 rounded-lg py-1.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="pb-4 text-sm font-medium text-muted">Data</th>
                <th className="pb-4 text-sm font-medium text-muted">Tipo</th>
                <th className="pb-4 text-sm font-medium text-muted">Descrição</th>
                <th className="pb-4 text-sm font-medium text-muted text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-muted" />
                      {new Date(t.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4">
                    <Badge variant={t.type === 'In' ? 'green' : 'red'}>
                      {t.type === 'In' ? 'Entrada' : 'Saída'}
                    </Badge>
                  </td>
                  <td className="py-4 text-sm font-medium text-white">{t.description}</td>
                  <td className={`py-4 text-sm text-right font-bold ${t.type === 'In' ? 'text-success' : 'text-danger'}`}>
                    {t.type === 'In' ? '+' : '-'} R$ {t.value.toLocaleString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-muted">Nenhuma transação encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Finance;
