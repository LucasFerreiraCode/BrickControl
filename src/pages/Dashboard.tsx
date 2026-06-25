import React from 'react';
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
import { Card, StatCard, Badge } from '../components/ui/Common';
import { mockBricks, financialSummary, monthlyEvolution } from '../data/mockData';

const Dashboard = () => {
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
          value={`R$ ${financialSummary.currentCapital.toLocaleString()}`} 
          icon={DollarSign} 
          trend="+12%" 
          color="blue"
        />
        <StatCard 
          title="Capital de Giro" 
          value={`R$ ${financialSummary.workingCapital.toLocaleString()}`} 
          icon={TrendingUp} 
          color="green"
        />
        <StatCard 
          title="Lucro Acumulado" 
          value={`R$ ${financialSummary.accumulatedProfit.toLocaleString()}`} 
          icon={TrendingUp} 
          trend="+8%" 
          color="amber"
        />
        <StatCard 
          title="ROI Médio" 
          value={`${financialSummary.averageROI}%`} 
          icon={ArrowUpRight} 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Evolução Patrimonial</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-muted">
              <option>Este Ano</option>
              <option>Últimos 6 meses</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEvolution}>
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
                />
                <Area type="monotone" dataKey="equity" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorEquity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Secondary Chart */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Lucro por Mês</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                  {monthlyEvolution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === monthlyEvolution.length - 1 ? '#2563EB' : '#334155'} />
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
          <button className="text-primary text-sm font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-8">Ver todos</button>
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
              {mockBricks.slice(0, 3).map((brick) => (
                <tr key={brick.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 font-medium text-white">{brick.name}</td>
                  <td className="py-4">
                    <Badge variant={brick.status === 'Sold' ? 'green' : brick.status === 'Reserved' ? 'yellow' : 'gray'}>
                      {brick.status === 'In Stock' ? 'Em Estoque' : brick.status === 'Reserved' ? 'Reservado' : 'Vendido'}
                    </Badge>
                  </td>
                  <td className="py-4 text-right text-muted">R$ {brick.purchasePrice.toLocaleString()}</td>
                  <td className="py-4 text-right text-muted">{brick.salePrice ? `R$ ${brick.salePrice.toLocaleString()}` : '-'}</td>
                  <td className="py-4 text-right font-semibold text-success">
                    {brick.salePrice ? `+ R$ ${(brick.salePrice - brick.purchasePrice - brick.fees - brick.shipping).toLocaleString()}` : '-'}
                  </td>
                </tr>
              ))}
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
          <p className="text-slate-400 text-lg leading-relaxed font-medium">Seu lucro médio aumentou <span className="text-emerald-400 font-bold">18%</span> em relação ao mês anterior. A categoria de celulares representa <span className="text-primary font-bold">72%</span> do seu faturamento atual.</p>
        </div>
        <Badge variant="blue" className="relative z-10">Inteligência Artificial</Badge>
      </div>
    </div>
  );
};

export default Dashboard;
