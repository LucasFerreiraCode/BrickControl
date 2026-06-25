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
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Visão Geral</h2>
        <p className="text-muted">Bem-vindo de volta! Aqui está o resumo do seu crescimento hoje.</p>
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
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Últimos Bricks</h3>
          <button className="text-primary text-sm font-medium hover:underline">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="pb-4 text-sm font-medium text-muted">Produto</th>
                <th className="pb-4 text-sm font-medium text-muted">Status</th>
                <th className="pb-4 text-sm font-medium text-muted text-right">Compra</th>
                <th className="pb-4 text-sm font-medium text-muted text-right">Venda</th>
                <th className="pb-4 text-sm font-medium text-muted text-right">Lucro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
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
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
          <ArrowUpRight size={28} />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">Insight Inteligente</h4>
          <p className="text-muted text-sm">Seu lucro médio aumentou 18% em relação ao mês anterior. A categoria de celulares representa 72% do seu faturamento atual. Considere reinvestir o lucro do iPhone 13 em novos acessórios.</p>
        </div>
        <Badge variant="blue">Premium</Badge>
      </div>
    </div>
  );
};

export default Dashboard;
