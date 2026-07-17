import { useMemo } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Activity,
  Layers,
  Sparkles,
  ShoppingCart,
  Package,
  Target,
  Heart,
  AlertTriangle,
  Zap,
  Crown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Card, StatCard, Badge, Button } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { monthlyEvolution } from '../data/mockData';

const Dashboard = () => {
  const { bricks, stats } = useBricks();
  
  // Saúde do Negócio insights
  const insights = useMemo(() => {
    const sold = bricks.filter(b => b.status === 'Sold');
    const items: { icon: React.ElementType; text: string; color: string }[] = [];

    // Modelo mais lucrativo
    if (sold.length > 0) {
      const profitByModel: Record<string, number> = {};
      sold.forEach(b => {
        const profit = (b.salePrice || 0) - b.totalInvested - (b.commission || 0) - (b.saleFees || 0) - (b.saleShipping || 0);
        profitByModel[b.model] = (profitByModel[b.model] || 0) + profit;
      });
      const bestModel = Object.entries(profitByModel).sort((a, b) => b[1] - a[1])[0];
      if (bestModel) {
        items.push({
          icon: Crown,
          text: `O ${bestModel[0]} foi o modelo mais lucrativo, gerando R$ ${bestModel[1].toLocaleString()} de lucro.`,
          color: 'text-amber-400'
        });
      }
    }

    // Alerta de manutenção
    const totalMaintenance = bricks.reduce((acc, b) => acc + b.maintenanceCost, 0);
    if (totalMaintenance > 500) {
      items.push({
        icon: AlertTriangle,
        text: `Você gastou R$ ${totalMaintenance.toLocaleString()} com manutenção. Priorize aparelhos em melhor estado.`,
        color: 'text-amber-400'
      });
    }

    // Projeção
    if (stats.currentMonthLucro > 0) {
      const dayOfMonth = new Date().getDate();
      const projectedMonthly = Math.round((stats.currentMonthLucro / dayOfMonth) * 30);
      items.push({
        icon: Target,
        text: `Se manter o ritmo atual, seu lucro projetado para o fim do mês será de R$ ${projectedMonthly.toLocaleString()}.`,
        color: 'text-emerald-400'
      });
    }

    // ROI médio
    if (stats.averageROI > 0) {
      items.push({
        icon: Zap,
        text: `Seu ROI médio por aparelho vendido é de ${stats.averageROI}%. ${stats.averageROI > 30 ? 'Excelente desempenho!' : 'Busque margem acima de 30%.'}`,
        color: 'text-primary'
      });
    }

    // Estoque parado
    const inStock = bricks.filter(b => b.status === 'In Stock' || b.status === 'In Maintenance');
    if (inStock.length > 3) {
      items.push({
        icon: Package,
        text: `Você tem ${inStock.length} aparelhos parados. Considere precificar de forma mais competitiva.`,
        color: 'text-rose-400'
      });
    }

    return items.length > 0 ? items : [{
      icon: Sparkles,
      text: 'Comece a cadastrar seus aparelhos pra que possamos gerar insights inteligentes do seu negócio!',
      color: 'text-primary'
    }];
  }, [bricks, stats]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
            Electro<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Control</span>
          </h1>
          <p className="text-muted text-xl font-medium tracking-tight">Gestão inteligente de compra e venda de eletrônicos.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/inventory">
            <Button className="px-8">+ Novo Aparelho</Button>
          </Link>
        </div>
      </header>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Capital Total" 
          value={`R$ ${stats.currentCapital.toLocaleString()}`} 
          icon={Activity} 
          color="blue"
        />
        <StatCard 
          title="Investido em Estoque" 
          value={`R$ ${stats.workingCapital.toLocaleString()}`} 
          icon={Layers} 
          color="purple"
        />
        <StatCard 
          title="Lucro Líquido" 
          value={`R$ ${stats.accumulatedProfit.toLocaleString()}`} 
          icon={TrendingUp} 
          trend={stats.averageROI > 0 ? `+${stats.averageROI}% ROI` : undefined}
          color="green"
        />
        <StatCard 
          title="Faturamento Total" 
          value={`R$ ${stats.totalRevenue.toLocaleString()}`} 
          icon={ShoppingCart} 
          color="amber"
        />
      </div>

      {/* Segunda fileira de KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: 'Em Estoque', value: stats.stockProducts, color: 'text-blue-400' },
          { label: 'Reservados', value: stats.reservedProducts, color: 'text-amber-400' },
          { label: 'Vendidos', value: stats.soldProducts, color: 'text-emerald-400' },
          { label: 'Manutenção', value: stats.maintenanceProducts, color: 'text-rose-400' },
          { label: 'Ticket Médio', value: `R$ ${stats.ticketMedio.toLocaleString()}`, color: 'text-purple-400' },
          { label: 'Lucro do Mês', value: `R$ ${stats.currentMonthLucro.toLocaleString()}`, color: 'text-emerald-400' },
        ].map((kpi, i) => (
          <Card key={i} className="p-5 text-center">
            <p className="text-[9px] font-black text-muted uppercase tracking-[0.15em] mb-1">{kpi.label}</p>
            <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Section */}
        <Card className="lg:col-span-8 p-10 bg-slate-900/40 relative group">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tighter mb-1">Evolução Patrimonial</h3>
              <p className="text-xs font-bold text-muted uppercase tracking-[0.2em]">Crescimento nos últimos 6 meses</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEvolution}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
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
                  tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 700 }}
                  labelStyle={{ fontWeight: 800, color: '#8b5cf6', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px' }}
                  formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="equity" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorEquity)" name="Patrimônio" />
                <Area type="monotone" dataKey="profit" stroke="#34D399" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" name="Lucro" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Saúde do Negócio */}
        <Card className="lg:col-span-4 p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/10 flex flex-col">
          <h4 className="text-lg font-black text-white mb-2 flex items-center gap-2">
            <Heart size={20} className="text-rose-400" />
            Saúde do Negócio
          </h4>
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.15em] mb-6">Insights baseados nos seus dados</p>
          
          <div className="space-y-4 flex-1 overflow-y-auto">
            {insights.map((insight, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all"
              >
                <insight.icon size={18} className={`${insight.color} shrink-0 mt-0.5`} />
                <p className="text-sm font-medium text-slate-300 leading-relaxed">{insight.text}</p>
              </motion.div>
            ))}
          </div>

          <Link to="/ai-advisor" className="mt-6">
            <Button variant="secondary" className="w-full text-[10px] uppercase tracking-widest font-black py-3">
              <Sparkles size={14} /> Consultar IA
            </Button>
          </Link>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="p-10 bg-slate-900/30 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tighter">Últimos Aparelhos</h3>
            <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] mt-1">Últimas aquisições do seu estoque</p>
          </div>
          <Link to="/inventory">
            <Button variant="ghost" className="text-[10px] uppercase font-black tracking-[0.2em]">Ver Estoque Completo <ArrowUpRight size={14} /></Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Aparelho</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Marca</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Status</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Investido</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Lucro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bricks.length > 0 ? bricks.slice().reverse().slice(0, 5).map((brick) => {
                const profit = brick.salePrice 
                  ? (brick.salePrice - brick.totalInvested - (brick.commission || 0) - (brick.saleFees || 0) - (brick.saleShipping || 0))
                  : 0;
                return (
                  <tr key={brick.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-6 font-black text-white text-base tracking-tight">{brick.model}</td>
                    <td className="py-6 text-sm text-slate-400 font-bold">{brick.brand}</td>
                    <td className="py-6">
                      <Badge variant={
                        brick.status === 'Sold' ? 'green' : 
                        brick.status === 'Reserved' ? 'yellow' : 
                        brick.status === 'In Maintenance' ? 'red' : 'gray'
                      }>
                        {brick.status === 'In Stock' ? 'Disponível' : brick.status === 'Reserved' ? 'Reservado' : brick.status === 'In Maintenance' ? 'Manutenção' : 'Vendido'}
                      </Badge>
                    </td>
                    <td className="py-6 text-right text-slate-400 font-bold">R$ {brick.totalInvested.toLocaleString()}</td>
                    <td className={`py-6 text-right font-black text-lg ${brick.salePrice ? (profit >= 0 ? 'text-emerald-400' : 'text-rose-400') : 'text-muted'}`}>
                      {brick.salePrice ? `${profit >= 0 ? '+' : ''} R$ ${profit.toLocaleString()}` : '-'}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted font-bold uppercase tracking-widest opacity-30">Nenhum aparelho registrado</td>
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
