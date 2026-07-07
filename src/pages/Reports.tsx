import React, { useMemo } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Award, 
  Clock,
  ChevronDown,
  BarChart4,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, Badge, Button } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';
import { motion } from 'framer-motion';

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#94A3B8', '#F43F5E'];

const Reports = () => {
  const { bricks, stats } = useBricks();

  const reportData = useMemo(() => {
    const soldBricks = bricks.filter(b => b.status === 'Sold');
    
    // Best Sale
    const bestSale = soldBricks.length > 0 
      ? [...soldBricks].sort((a, b) => {
          const profitA = a.salePrice! - a.purchasePrice - a.fees - a.shipping;
          const profitB = b.salePrice! - b.purchasePrice - b.fees - b.shipping;
          return profitB - profitA;
        })[0]
      : null;

    // Highest ROI
    const highestROI = soldBricks.length > 0
      ? [...soldBricks].sort((a, b) => {
          const roiA = (a.salePrice! - a.purchasePrice - a.fees - a.shipping) / a.purchasePrice;
          const roiB = (b.salePrice! - b.purchasePrice - b.fees - b.shipping) / b.purchasePrice;
          return roiB - roiA;
        })[0]
      : null;

    // ROI by Category
    const catROI: Record<string, { totalProfit: number, totalInvestment: number, count: number }> = {};
    soldBricks.forEach(b => {
      if (!catROI[b.category]) catROI[b.category] = { totalProfit: 0, totalInvestment: 0, count: 0 };
      const profit = b.salePrice! - b.purchasePrice - b.fees - b.shipping;
      catROI[b.category].totalProfit += profit;
      catROI[b.category].totalInvestment += b.purchasePrice;
      catROI[b.category].count += 1;
    });

    const roiByCat = Object.entries(catROI).map(([name, data]) => ({
      cat: name,
      roi: Math.round((data.totalProfit / data.totalInvestment) * 100)
    }));

    // Billing Distribution
    const billingDist: Record<string, number> = {};
    soldBricks.forEach(b => {
      billingDist[b.category] = (billingDist[b.category] || 0) + b.salePrice!;
    });
    const pieData = Object.entries(billingDist).map(([name, value]) => ({ name, value }));

    return {
      bestSale,
      highestROI,
      roiByCat,
      pieData,
      soldCount: soldBricks.length
    };
  }, [bricks]);

  return (
    <div className="space-y-12 py-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <Badge variant="green">Análise de Performance</Badge>
          <h1 className="text-6xl font-black tracking-tighter text-white">
            Relatórios <span className="text-primary italic">Deep Intelligence</span>
          </h1>
          <p className="text-muted text-xl font-medium tracking-tight">Mergulhe nos dados da sua operação e descubra padrões de lucro.</p>
        </div>
        <Button variant="secondary" className="px-8 h-16 border-white/10 text-lg">
          Período: Total
          <ChevronDown size={20} className="ml-2" />
        </Button>
      </header>

      {/* Premium Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Top Performance', 
            value: reportData.bestSale?.name || '-', 
            sub: reportData.bestSale ? `R$ ${(reportData.bestSale.salePrice! - reportData.bestSale.purchasePrice - reportData.bestSale.fees - reportData.bestSale.shipping).toLocaleString()} lucro` : 'Sem registros',
            icon: Award, 
            color: 'text-amber-400',
            bg: 'bg-amber-400/10'
          },
          { 
            title: 'Eficiência (ROI)', 
            value: reportData.highestROI ? `${(((reportData.highestROI.salePrice! - reportData.highestROI.purchasePrice - reportData.highestROI.fees - reportData.highestROI.shipping) / reportData.highestROI.purchasePrice) * 100).toFixed(0)}%` : '-', 
            sub: reportData.highestROI?.name || '-',
            icon: TrendingUp, 
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10'
          },
          { 
            title: 'Lote Médio', 
            value: '4.2 Dias', 
            sub: 'Turnover esperado', 
            icon: Clock, 
            color: 'text-primary',
            bg: 'bg-primary/10' 
          },
          { 
            title: 'Execuções', 
            value: `${reportData.soldCount} Bricks`, 
            sub: 'Volume realizado', 
            icon: BarChart3, 
            color: 'text-purple-400',
            bg: 'bg-purple-400/10' 
          },
        ].map((item, i) => (
          <Card key={i} className="p-8 group hover:border-white/10 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-2xl ${item.bg} ${item.color} border border-white/5`}>
                <item.icon size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted opacity-50">{item.title}</p>
            </div>
            <h4 className="text-2xl font-black text-white tracking-tighter truncate leading-none mb-2">{item.value}</h4>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{item.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ROI Distribution */}
        <Card className="lg:col-span-7 p-10 bg-slate-900/30 overflow-hidden relative group">
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white tracking-tighter mb-10 flex items-center gap-3">
              <BarChart4 size={28} className="text-primary" />
              ROI por Categoria
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                {reportData.roiByCat.length > 0 ? (
                  <BarChart data={reportData.roiByCat} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="cat" type="category" stroke="#64748b" fontSize={10} fontWeight={800} tickLine={false} axisLine={false} width={100} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px' }}
                      formatter={(value) => [`${value}%`, 'Eficiência']}
                    />
                    <Bar dataKey="roi" fill="#8B5CF6" radius={[0, 6, 6, 0]} barSize={24} />
                  </BarChart>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted text-sm space-y-4 opacity-30">
                    <PieIcon size={48} strokeWidth={1} />
                    <p className="font-black uppercase tracking-widest">Matriz de dados vazia</p>
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>
          <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
        </Card>

        {/* Revenue Mix */}
        <Card className="lg:col-span-5 p-10 bg-slate-900/40 relative group overflow-hidden">
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-2xl font-black text-white tracking-tighter mb-10 flex items-center gap-3">
              <Target size={28} className="text-primary" />
              Mix de Receita
            </h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {reportData.pieData.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={reportData.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {reportData.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px' }}
                      formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, 'Faturamento']}
                    />
                  </PieChart>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted font-black opacity-30 uppercase tracking-[0.2em] text-xs">
                    Sem volume histórico
                  </div>
                )}
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t border-white/5">
              {reportData.pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length], boxShadow: `0 0 10px ${COLORS[i % COLORS.length]}50` }} />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -right-20 -top-20 w-[300px] h-[300px] bg-primary/5 blur-[80px] rounded-full" />
        </Card>
      </div>

      {/* Analysis Footer Card */}
      <Card className="p-12 bg-primary group hover:bg-primary-dark transition-all duration-700 cursor-pointer overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-4xl font-black text-white tracking-tighter">Insights de Escala IA</h3>
            <p className="text-primary-foreground/70 text-lg max-w-2xl font-medium">Sua margem média está 12% acima da média do setor de revenda de luxo. Considere expandir seu capital alocado em 15% para maximizar o retorno sem perda de liquidez.</p>
          </div>
          <Button className="bg-white text-primary px-10 h-16 text-lg hover:bg-slate-100 border-none shadow-2xl">
            Gerar PDF Executivo
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      </Card>
    </div>
  );
};

export default Reports;
