import { useMemo } from 'react';
import { BarChart3, Crown, Clock, Wrench, Truck, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, Badge, Button } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';
import { motion } from 'framer-motion';

const COLORS = ['#8B5CF6', '#34D399', '#FBBF24', '#F87171', '#60A5FA', '#A78BFA'];

const Reports = () => {
  const { bricks, stats } = useBricks();

  const sold = useMemo(() => bricks.filter(b => b.status === 'Sold'), [bricks]);

  // Lucro por marca
  const profitByBrand = useMemo(() => {
    const map: Record<string, number> = {};
    sold.forEach(b => {
      const profit = (b.salePrice || 0) - b.totalInvested - (b.commission || 0) - (b.saleFees || 0) - (b.saleShipping || 0);
      map[b.brand] = (map[b.brand] || 0) + profit;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [sold]);

  // Lucro por modelo
  const profitByModel = useMemo(() => {
    const map: Record<string, number> = {};
    sold.forEach(b => {
      const profit = (b.salePrice || 0) - b.totalInvested - (b.commission || 0) - (b.saleFees || 0) - (b.saleShipping || 0);
      map[b.model] = (map[b.model] || 0) + profit;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [sold]);

  // Gastos manutenção e frete
  const costBreakdown = useMemo(() => {
    const maint = bricks.reduce((a, b) => a + b.maintenanceCost, 0);
    const ship = bricks.reduce((a, b) => a + b.shippingCost, 0);
    const addl = bricks.reduce((a, b) => a + b.additionalCosts, 0);
    return [
      { name: 'Manutenção', value: maint },
      { name: 'Frete', value: ship },
      { name: 'Outros Custos', value: addl },
    ].filter(i => i.value > 0);
  }, [bricks]);

  // Ranking de melhores negociações
  const bestDeals = useMemo(() => {
    return sold.map(b => {
      const profit = (b.salePrice || 0) - b.totalInvested - (b.commission || 0) - (b.saleFees || 0) - (b.saleShipping || 0);
      const roi = b.totalInvested > 0 ? ((profit / b.totalInvested) * 100) : 0;
      const days = b.saleDate && b.purchaseDate
        ? Math.ceil((new Date(b.saleDate).getTime() - new Date(b.purchaseDate).getTime()) / (1000 * 60 * 60 * 24))
        : null;
      return { ...b, profit, roi, days };
    }).sort((a, b) => b.profit - a.profit);
  }, [sold]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <header className="pb-6 border-b border-white/5">
        <Badge variant="blue">Análises</Badge>
        <h1 className="text-6xl font-black tracking-tighter text-white mt-2">
          Relatórios <span className="text-primary italic">Inteligentes</span>
        </h1>
        <p className="text-muted text-xl font-medium tracking-tight mt-2">Análise detalhada por marca, modelo e performance de vendas.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Total Vendido</p>
          <p className="text-3xl font-black text-white">{stats.soldProducts}</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Faturamento</p>
          <p className="text-3xl font-black text-emerald-400">R$ {stats.totalRevenue.toLocaleString()}</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Lucro Líquido</p>
          <p className="text-3xl font-black text-emerald-400">R$ {stats.accumulatedProfit.toLocaleString()}</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">ROI Médio</p>
          <p className="text-3xl font-black text-primary">{stats.averageROI}%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lucro por Marca */}
        <Card className="p-8 bg-slate-900/40">
          <div className="flex items-center gap-2 mb-8">
            <BarChart3 size={20} className="text-primary" />
            <h3 className="text-xl font-black text-white tracking-tighter">Lucro por Marca</h3>
          </div>
          {profitByBrand.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={profitByBrand}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `R$${v}`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }} formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, 'Lucro']} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {profitByBrand.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted text-center py-20 font-bold">Nenhuma venda registrada ainda.</p>
          )}
        </Card>

        {/* Distribuição de Custos */}
        <Card className="p-8 bg-slate-900/40">
          <div className="flex items-center gap-2 mb-8">
            <Wrench size={20} className="text-amber-400" />
            <h3 className="text-xl font-black text-white tracking-tighter">Distribuição de Custos</h3>
          </div>
          {costBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={costBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                  {costBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${value ? Number(value).toLocaleString() : '0'}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted text-center py-20 font-bold">Nenhum custo registrado.</p>
          )}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {costBreakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs font-bold text-muted">{item.name}: R$ {item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Ranking de Melhores Negociações */}
      <Card className="p-10 bg-slate-900/30 overflow-hidden">
        <div className="flex items-center gap-2 mb-8">
          <Crown size={20} className="text-amber-400" />
          <h3 className="text-2xl font-black text-white tracking-tighter">Ranking de Melhores Negociações</h3>
        </div>
        
        {bestDeals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted">#</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted">Aparelho</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted">Marca</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted text-right">Investido</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted text-right">Vendido</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted text-right">Lucro</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted text-right">ROI</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted text-right">Dias</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bestDeals.map((deal, i) => (
                  <tr key={deal.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-5">
                      <span className={`text-sm font-black ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-700' : 'text-muted'}`}>
                        {i + 1}º
                      </span>
                    </td>
                    <td className="py-5 font-black text-white text-sm">{deal.model}</td>
                    <td className="py-5 text-sm text-slate-400 font-bold">{deal.brand}</td>
                    <td className="py-5 text-right text-sm text-slate-400 font-bold">R$ {deal.totalInvested.toLocaleString()}</td>
                    <td className="py-5 text-right text-sm text-white font-bold">R$ {(deal.salePrice || 0).toLocaleString()}</td>
                    <td className={`py-5 text-right text-sm font-black ${deal.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {deal.profit >= 0 ? '+' : ''}R$ {deal.profit.toLocaleString()}
                    </td>
                    <td className="py-5 text-right text-sm font-black text-primary">{deal.roi.toFixed(0)}%</td>
                    <td className="py-5 text-right text-sm text-muted font-bold">
                      <span className="flex items-center justify-end gap-1">
                        <Clock size={12} />
                        {deal.days !== null ? `${deal.days}d` : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted text-center py-20 font-bold uppercase tracking-widest opacity-30">Nenhuma venda registrada</p>
        )}
      </Card>
    </motion.div>
  );
};

export default Reports;
