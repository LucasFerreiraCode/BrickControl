import React, { useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar, 
  Cell
} from 'recharts';
import { Card, StatCard, Badge, Button } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { bricks, stats, transactions } = useBricks();
  
  // Dashboard Chart Data (Last 6 Months)
  const chartData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return {
        month: d.toLocaleString('pt-BR', { month: 'short' }),
        monthNum: d.getMonth(),
        year: d.getFullYear(),
        equity: 0,
        profit: 0
      };
    });

    // Calculate profit per month from transactions
    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const monthIdx = months.findIndex(m => m.monthNum === tDate.getMonth() && m.year === tDate.getFullYear());
      if (monthIdx !== -1) {
        if (t.type === 'In') {
          // Check if it's a sale profit or just income
          // For simplicity, we'll treat 'In' minus 'Out' as profit movement in this view
          months[monthIdx].profit += t.value;
        } else {
          months[monthIdx].profit -= t.value;
        }
      }
    });

    // Simular evolução patrimonial (Capital de Giro + Lucro)
    let runningEquity = stats.workingCapital; 
    months.forEach(m => {
      runningEquity += m.profit;
      m.equity = runningEquity;
    });

    return months;
  }, [transactions, stats.workingCapital]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tighter text-white">
          Visão <span className="text-primary">Geral</span>
        </h1>
        <p className="text-muted text-lg font-medium">Bem-vindo de volta! Aqui está o resumo do seu crescimento hoje.</p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Capital Atual" 
          value={`R$ ${stats.currentCapital.toLocaleString()}`} 
          icon={DollarSign} 
          trend="+12%" 
          color="blue"
        />
        <StatCard 
          title="Capital de Giro" 
          value={`R$ ${stats.workingCapital.toLocaleString()}`} 
          icon={TrendingUp} 
          color="green"
        />
        <StatCard 
          title="Lucro Acumulado" 
          value={`R$ ${stats.accumulatedProfit.toLocaleString()}`} 
          icon={TrendingUp} 
          trend="+8%" 
          color="amber"
        />
        <StatCard 
          title="ROI Médio" 
          value={`${stats.averageROI}%`} 
          icon={ArrowUpRight} 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Evolução Patrimonial</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-muted outline-none">
              <option>Últimos 6 meses</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, 'Patrimônio']}
                />
                <Area type="monotone" dataKey="equity" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorEquity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Secondary Chart */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Balanço por Mês</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, 'Balanço']}
                />
                <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Bricks Table */}
      <Card className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-white tracking-tight">Últimos Bricks</h3>
          <Link to="/inventory">
            <button className="text-primary text-sm font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-8">Ver todos</button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-card-border">
                <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Produto</th>
                <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Status</th>
                <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-right">Compra</th>
                <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-right">Venda</th>
                <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-right">Lucro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {bricks.length > 0 ? bricks.slice().reverse().slice(0, 5).map((brick) => (
                <tr key={brick.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 font-medium text-white">{brick.name}</td>
                  <td className="py-4">
                    <Badge variant={brick.status === 'Sold' ? 'green' : brick.status === 'Reserved' ? 'yellow' : 'gray'}>
                      {brick.status === 'In Stock' ? 'Em Estoque' : brick.status === 'Reserved' ? 'Reservado' : 'Vendido'}
                    </Badge>
                  </td>
                  <td className="py-4 text-right text-muted">R$ {brick.purchasePrice.toLocaleString()}</td>
                  <td className="py-4 text-right text-muted">{brick.salePrice ? `R$ ${brick.salePrice.toLocaleString()}` : '-'}</td>
                  <td className={`py-4 text-right font-semibold ${brick.salePrice ? 'text-success' : 'text-muted'}`}>
                    {brick.salePrice ? `+ R$ ${(brick.salePrice - (brick.purchasePrice + brick.fees + brick.shipping)).toLocaleString()}` : '-'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted">Nenhum brick registrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Insights */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-white/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-colors duration-700" />
        <div className="w-16 h-16 rounded-2xl bg-primary shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center text-white shrink-0 rotate-3">
          <ArrowUpRight size={32} strokeWidth={2.5} />
        </div>
        <div className="flex-1 relative z-10">
          <h4 className="text-2xl font-bold text-white mb-2 tracking-tight">Insight Inteligente</h4>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            {stats.soldProducts > 0 
              ? `Seu ROI médio de ${stats.averageROI}% está acima do mercado. Continue focando em produtos de alta rotatividade.`
              : 'Comece a vender seus produtos para ver insights detalhados sobre sua performance de vendas.'}
          </p>
        </div>
        <Badge variant="blue" className="relative z-10">Inteligência Artificial</Badge>
      </div>
    </div>
  );
};

export default Dashboard;
