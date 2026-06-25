import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, Percent, DollarSign, Truck, Tag, TrendingUp } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui/Common';

const Calculator = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(1000);
  const [fees, setFees] = useState<number>(50);
  const [shipping, setShipping] = useState<number>(20);
  const [targetROI, setTargetROI] = useState<number>(30);

  // Results
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [margin, setMargin] = useState<number>(0);

  useEffect(() => {
    const totalCost = purchasePrice + fees + shipping;
    const calculatedProfit = totalCost * (targetROI / 100);
    const calculatedSellingPrice = totalCost + calculatedProfit;
    const calculatedMargin = (calculatedProfit / calculatedSellingPrice) * 100;

    setSellingPrice(calculatedSellingPrice);
    setProfit(calculatedProfit);
    setMargin(calculatedMargin);
  }, [purchasePrice, fees, shipping, targetROI]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <header className="text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CalcIcon size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Calculadora de Brick</h2>
        <p className="text-muted">Simule seus investimentos e descubra o preço ideal de venda para garantir seu lucro.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <Card className="space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4">Configuração do Brick</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted flex items-center gap-2">
              <DollarSign size={14} /> Valor de Compra
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
              <input 
                type="number" 
                className="w-full bg-white/5 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 transition-all font-semibold"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Tag size={14} /> Taxas
              </label>
              <input 
                type="number" 
                className="w-full bg-white/5 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:ring-2 focus:ring-primary/50 transition-all"
                value={fees}
                onChange={(e) => setFees(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Truck size={14} /> Frete
              </label>
              <input 
                type="number" 
                className="w-full bg-white/5 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:ring-2 focus:ring-primary/50 transition-all"
                value={shipping}
                onChange={(e) => setShipping(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Percent size={14} /> Lucro Desejado (ROI)
              </label>
              <span className="text-primary font-bold">{targetROI}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="100" 
              step="5"
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              value={targetROI}
              onChange={(e) => setTargetROI(Number(e.target.value))}
            />
          </div>
        </Card>

        {/* Results */}
        <Card className="bg-primary/5 border-primary/20 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Resultado da Simulação</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-sm text-muted mb-1">Preço Sugerido de Venda</p>
                <h4 className="text-4xl font-bold text-white">R$ {sellingPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-success/10 rounded-2xl border border-success/20">
                  <p className="text-xs text-success font-medium uppercase mb-1">Lucro Esperado</p>
                  <p className="text-xl font-bold text-white">R$ {profit.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                  <p className="text-xs text-purple-400 font-medium uppercase mb-1">Margem Líquida</p>
                  <p className="text-xl font-bold text-white">{margin.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted">
              <TrendingUp size={14} className="text-success" />
              <span>Custo total do investimento: <strong>R$ {(purchasePrice + fees + shipping).toLocaleString()}</strong></span>
            </div>
            <Button className="w-full mt-4">Salvar este Brick</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calculator;
