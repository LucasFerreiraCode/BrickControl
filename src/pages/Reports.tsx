import React from 'react';
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
