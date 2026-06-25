import React from 'react';
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
import { transactions, monthlyEvolution } from '../data/mockData';

const Finance = () => {
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
          <Button>Novo Lançamento</Button>
        </div>
      </header>

      {/* Financial Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Saldo Total', value: 'R$ 15.420', icon: Wallet, color: 'text-primary' },
          { title: 'Entradas (Mês)', value: 'R$ 8.200', icon: ArrowUpCircle, color: 'text-success' },
          { title: 'Saídas (Mês)', value: 'R$ 3.850', icon: ArrowDownCircle, color: 'text-danger' },
          { title: 'Capital Alocado', value: 'R$ 7.220', icon: CreditCard, color: 'text-amber-500' },
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
            <h3 className="text-lg font-semibold text-white">Fluxo de Caixa (Entradas vs Saídas)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="profit" name="Entradas" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="equity" name="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categories / Insights */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Resumo de Ativos</h3>
          <div className="space-y-6">
            {[
              { label: 'Smartphones', value: 72, color: 'bg-primary' },
              { label: 'Games', value: 18, color: 'bg-success' },
              { label: 'Eletrônicos', value: 10, color: 'bg-amber-500' },
            ].map((cat) => (
              <div key={cat.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white font-medium">{cat.label}</span>
                  <span className="text-muted">{cat.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 bg-white/5 rounded-xl border border-white/5">
            <p className="text-xs text-muted leading-relaxed">
              * Você possui <strong>R$ 7.220</strong> investidos em 12 produtos no momento. Seu retorno esperado é de aproximadamente <strong>R$ 2.450</strong>.
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
              {transactions.map((t) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Finance;
