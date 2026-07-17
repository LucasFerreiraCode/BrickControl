import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, Badge, Button } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';
import { Award, TrendingUp, ChevronDown } from 'lucide-react';

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#94A3B8', '#F43F5E'];

const Reports = () => {
  const { bricks } = useBricks();

  const {
    soldBricks,
    totalProfit,
    bestSale,
    highestROI,
    roiByCategory,
    revenueDist,
  } = useMemo(() => {
    const sold = bricks.filter(b => b.status === 'Sold');
    const profit = sold.reduce((sum, b) => sum + (b.salePrice! - b.purchasePrice - b.fees - b.shipping), 0);
    const best = sold.length
      ? sold.reduce((prev, cur) => (cur.salePrice! - cur.purchasePrice - cur.fees - cur.shipping) >
        (prev.salePrice! - prev.purchasePrice - prev.fees - prev.shipping) ? cur : prev)
      : null;
    const bestRoi = sold.length
      ? sold.reduce((prev, cur) => {
          const roiCur = (cur.salePrice! - cur.purchasePrice - cur.fees - cur.shipping) / cur.purchasePrice;
          const roiPrev = (prev.salePrice! - prev.purchasePrice - prev.fees - prev.shipping) / prev.purchasePrice;
          return roiCur > roiPrev ? cur : prev;
        })
      : null;

    const catMap = {} as Record<string, { profit: number; count: number }>;
    sold.forEach(b => {
      if (!catMap[b.category]) catMap[b.category] = { profit: 0, count: 0 };
      catMap[b.category].profit += b.salePrice! - b.purchasePrice - b.fees - b.shipping;
      catMap[b.category].count += 1;
    });
    const roiCat = Object.entries(catMap).map(([cat, data]) => ({
      cat,
      profit: Math.round((data.profit / data.count) * 100) / 100,
    }));

    const revMap: Record<string, number> = {};
    sold.forEach(b => {
      revMap[b.category] = (revMap[b.category] || 0) + b.salePrice!;
    });
    const revData = Object.entries(revMap).map(([cat, value]) => ({ name: cat, value }));

    return {
      soldBricks: sold,
      totalProfit: profit,
      bestSale: best,
      highestROI: bestRoi,
      roiByCategory: roiCat,
      revenueDist: revData,
    };
  }, [bricks]);

  return (
    <div className="space-y-8 py-8">
      <header className="flex items-center justify-between">
        <div>
          <Badge variant="green">Análise de Performance</Badge>
          <h1 className="text-4xl font-black text-white">Relatórios</h1>
          <p className="text-muted text-lg">Visão geral dos resultados.</p>
        </div>
        <Button variant="secondary" className="px-8 h-12">
          Período: Total <ChevronDown size={16} className="ml-1 inline" />
        </Button>
      </header>

      {/* Summary Card */}
      <Card className="p-6 grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Resumo</h2>
          <p className="text-white">Bricks vendidos: {soldBricks.length}</p>
          <p className="text-white">Lucro total: R$ {totalProfit.toLocaleString()}</p>
        </div>
        <div className="flex items-center space-x-2">
          {bestSale && (
            <div className="flex items-center">
              <Award size={20} className="text-amber-400" />
              <span className="text-white ml-1">Top: {bestSale.name}</span>
            </div>
          )}
          {highestROI && (
            <div className="flex items-center">
              <TrendingUp size={20} className="text-emerald-400" />
              <span className="text-white ml-1">
                ROI: {Math.round(((highestROI.salePrice! - highestROI.purchasePrice - highestROI.fees - highestROI.shipping) / highestROI.purchasePrice) * 100}%
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ROI by Category Bar */}
        <Card className="p-4">
          <h3 className="text-lg font-bold text-white mb-2">ROI por Categoria</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={roiByCategory} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="cat" type="category" stroke="#64748b" fontSize={12} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} formatter={(value) => [`${value}%`, 'ROI']} />
              <Bar dataKey="profit" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Distribution Pie */}
        <Card className="p-4">
          <h3 className="text-lg font-bold text-white mb-2">Distribuição de Receita</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={revenueDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                {revenueDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Faturamento']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed List */}
      <Card className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">Vendas</h3>
        <ul className="space-y-1">
          {soldBricks.map((b, i) => (
            <li key={i} className="text-white">
              {b.name}: R$ {(b.salePrice! - b.purchasePrice - b.fees - b.shipping).toLocaleString()}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Reports;

import { Card, Badge, Button } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';

const Reports = () => {
  const { bricks } = useBricks();
  const soldBricks = bricks.filter(b => b.status === 'Sold');
  const totalProfit = soldBricks.reduce((sum, b) =>
    sum + (b.salePrice! - b.purchasePrice - b.fees - b.shipping), 0);

  return (
    <div className="space-y-8 py-8">
      <header className="flex items-center justify-between">
        <div>
          <Badge variant="green">Análise de Performance</Badge>
          <h1 className="text-4xl font-black text-white">Relatórios</h1>
          <p className="text-muted text-lg">Visão simplificada dos resultados.</p>
        </div>
        <Button variant="secondary" className="px-8 h-12">Período: Total</Button>
      </header>

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Resumo</h2>
        <p className="text-white">Bricks vendidos: {soldBricks.length}</p>
        <p className="text-white">Lucro total: R$ {totalProfit.toLocaleString()}</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Vendas</h2>
        <ul className="space-y-2">
          {soldBricks.map((b, i) => (
            <li key={i} className="text-white">
              {b.name}: R$ {(b.salePrice! - b.purchasePrice - b.fees - b.shipping).toLocaleString()}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Reports;
