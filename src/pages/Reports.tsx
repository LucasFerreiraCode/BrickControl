import React, { useMemo } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Award, 
  Clock,
  ChevronDown
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

const COLORS = ['#2563EB', '#22C55E', '#F59E0B', '#94A3B8', '#8B5CF6'];

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
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Relatórios</h2>
          <p className="text-muted">Análise profunda do desempenho do seu negócio.</p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          Geral (Histórico)
          <ChevronDown size={16} />
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Melhor Venda', 
            value: reportData.bestSale?.name || '-', 
            sub: reportData.bestSale ? `R$ ${(reportData.bestSale.salePrice! - reportData.bestSale.purchasePrice - reportData.bestSale.fees - reportData.bestSale.shipping).toLocaleString()} lucro` : 'Sem vendas',
            icon: Award, 
            color: 'text-amber-500' 
          },
          { 
            title: 'Maior ROI', 
            value: reportData.highestROI ? `${(((reportData.highestROI.salePrice! - reportData.highestROI.purchasePrice - reportData.highestROI.fees - reportData.highestROI.shipping) / reportData.highestROI.purchasePrice) * 100).toFixed(0)}%` : '-', 
            sub: reportData.highestROI?.name || '-',
            icon: TrendingUp, 
            color: 'text-success' 
          },
          { title: 'Tempo Médio', value: '4.2 dias', sub: 'Para vender', icon: Clock, color: 'text-primary' },
          { title: 'Volume', value: `${reportData.soldCount} bricks`, sub: 'Vendidos', icon: BarChart3, color: 'text-purple-500' },
        ].map((item, i) => (
          <Card key={i} className="border-slate-800">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm text-muted font-medium">{item.title}</p>
              <item.icon size={18} className={item.color} />
            </div>
            <h4 className="text-xl font-bold text-white max-w-[150px] truncate">{item.value}</h4>
            <p className="text-xs text-muted mt-1">{item.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">ROI Médio por Categoria</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {reportData.roiByCat.length > 0 ? (
                <BarChart data={reportData.roiByCat} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="cat" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value}%`, 'ROI']}
                  />
                  <Bar dataKey="roi" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              ) : (
                <div className="h-full flex items-center justify-center text-muted text-sm">Dados insuficientes para gerar o gráfico.</div>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Distribuição de Faturamento</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {reportData.pieData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={reportData.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {reportData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, 'Faturamento']}
                  />
                </PieChart>
              ) : (
                <div className="h-full flex items-center justify-center text-muted text-sm">Dados insuficientes para gerar o gráfico.</div>
              )}
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {reportData.pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs text-muted">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;

