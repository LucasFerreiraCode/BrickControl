import React, { useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingDown,
  Activity,
  Layers,
  Sparkles
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
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { bricks, stats, transactions } = useBricks();
  
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

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const monthIdx = months.findIndex(m => m.monthNum === tDate.getMonth() && m.year === tDate.getFullYear());
      if (monthIdx !== -1) {
        if (t.type === 'In') months[monthIdx].profit += t.value;
        else months[monthIdx].profit -= t.value;
      }
    });

    let runningEquity = stats.workingCapital; 
    months.forEach(m => {
      runningEquity += m.profit;
      m.equity = runningEquity;
    });

    return months;
  }, [transactions, stats.workingCapital]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
        <div className="space-y-1">
          <Badge variant="blue">Dashboard Central</Badge>
          <h1 className="text-6xl font-black tracking-tighter text-white">
            Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Geral</span>
          </h1>
          <p className="text-muted text-xl font-medium tracking-tight">Estatísticas em tempo real do seu portfólio de investimento.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="px-8">Exportar PDF</Button>
          <Link to="/inventory">
            <Button className="px-8">Novo Brick</Button>
          </Link>
        </div>
      </header>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Capital Total" 
          value={`R$ ${stats.currentCapital.toLocaleString()}`} 
          icon={Activity} 
          trend="+14.2%" 
          color="blue"
        />
        <StatCard 
          title="Investimento Ativo" 
          value={`R$ ${stats.workingCapital.toLocaleString()}`} 
          icon={Layers} 
          color="purple"
        />
        <StatCard 
          title="Lucro Líquido" 
          value={`R$ ${stats.accumulatedProfit.toLocaleString()}`} 
          icon={TrendingUp} 
          trend="+8.5%" 
          color="green"
        />
        <StatCard 
          title="ROI Médio" 
          value={`${stats.averageROI}%`} 
          icon={Sparkles} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Section */}
        <Card className="lg:col-span-8 p-10 bg-slate-900/40 relative group">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tighter mb-1">Evolução Patrimonial</h3>
              <p className="text-xs font-bold text-muted uppercase tracking-[0.2em]">Crescimento nos últimos 6 meses</p>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-primary rounded-lg shadow-lg">Gráfico</button>
              <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-white transition-colors">Tabela</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={10} 
                  fontWeight={800} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ dy: 15 }}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  fontWeight={800} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `R$${value}`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 700 }}
                  labelStyle={{ fontWeight: 800, color: '#8b5cf6', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px' }}
                  formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, 'Total']}
                />
                <Area type="monotone" dataKey="equity" stroke="#8B5CF6" strokeWidth={4} fillOpacity={1} fill="url(#colorEquity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Secondary Info Grid - Bento Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="flex-1 p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/10">
            <h4 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-primary" />
              Insight da Semana
            </h4>
            <p className="text-slate-300 font-medium leading-relaxed mb-6">
              Seu portfólio de eletrônicos rendeu <span className="text-primary font-black">+24%</span> acima da média. Considere reinvestir o lucro acumulado para acelerar o crescimento.
            </p>
            <Button variant="secondary" className="w-full text-[10px] uppercase tracking-widest font-black py-3">Ver Detalhes</Button>
          </Card>
          
          <Card className="p-8 bg-emerald-500/5 border-emerald-500/10">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-black text-white uppercase tracking-widest leading-none">Balanço</h4>
              <Badge variant="green">Saudável</Badge>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted font-bold uppercase tracking-widest">Entradas</span>
                <span className="text-emerald-400 font-black">R$ {stats.totalIn.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }} />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted font-bold uppercase tracking-widest">Saídas</span>
                <span className="text-rose-400 font-black">R$ {stats.totalOut.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity Table */}
      <Card className="p-10 bg-slate-900/30 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tighter">Inventário Recente</h3>
            <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] mt-1">Últimas adições ao seu estoque</p>
          </div>
          <Link to="/inventory">
            <Button variant="ghost" className="text-[10px] uppercase font-black tracking-[0.2em]">Ver Inventário Completo <ArrowUpRight size={14} /></Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Investimento</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Status</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Preço Compra</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Lucro Realizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bricks.length > 0 ? bricks.slice().reverse().slice(0, 5).map((brick) => (
                <tr key={brick.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-6 font-black text-white text-lg tracking-tight">{brick.name}</td>
                  <td className="py-6">
                    <Badge variant={brick.status === 'Sold' ? 'green' : 'gray'}>
                      {brick.status === 'In Stock' ? 'Disponível' : brick.status === 'Reserved' ? 'Reservado' : 'Vendido'}
                    </Badge>
                  </td>
                  <td className="py-6 text-right text-slate-400 font-bold">R$ {brick.purchasePrice.toLocaleString()}</td>
                  <td className={`py-6 text-right font-black text-lg ${brick.salePrice ? 'text-emerald-400' : 'text-muted'}`}>
                    {brick.salePrice ? `+ R$ ${(brick.salePrice - (brick.purchasePrice + brick.fees + brick.shipping)).toLocaleString()}` : '-'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-muted font-bold uppercase tracking-widest opacity-30">Nenhum investimento registrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};

export default Dashboard;
