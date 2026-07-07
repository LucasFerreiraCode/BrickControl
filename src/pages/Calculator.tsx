import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, Percent, DollarSign, TrendingUp, Sparkles, ChevronRight, Save } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui/Common';
import { AddBrickModal } from '../components/modals/AddBrickModal';
import { motion } from 'framer-motion';

const Calculator = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(1000);

  const [targetROI, setTargetROI] = useState<number>(30);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Results
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [margin, setMargin] = useState<number>(0);

  useEffect(() => {
    const totalCost = purchasePrice;
    const calculatedProfit = totalCost * (targetROI / 100);
    const calculatedSellingPrice = totalCost + calculatedProfit;
    const calculatedMargin = (calculatedProfit / calculatedSellingPrice) * 100;

    setSellingPrice(calculatedSellingPrice);
    setProfit(calculatedProfit);
    setMargin(calculatedMargin);
  }, [purchasePrice, targetROI]);

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-8">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] floating">
          <Sparkles size={14} /> Intelligence Simulator
        </div>
        <h1 className="text-7xl font-black tracking-tighter text-white">
          Simulador de <span className="text-primary italic">Brick</span>
        </h1>
        <p className="text-muted text-xl max-w-2xl mx-auto font-medium">Analise a viabilidade de novos investimentos e calcule seu lucro planejado em segundos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Setup Panel */}
        <Card className="lg:col-span-12 xl:col-span-7 p-10 space-y-10 bg-slate-900/30">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <CalcIcon size={24} className="text-primary" />
            <h3 className="text-2xl font-black text-white tracking-tighter">Parâmetros do Ativo</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                <DollarSign size={14} className="text-primary" /> Valor de Compra
              </label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black">R$</span>
                <input 
                  type="number" 
                  className="premium-input w-full pl-14 text-xl"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                <Percent size={14} className="text-primary" /> Margem Desejada (ROI)
              </label>
              <div className="relative group">
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-primary font-black">%</span>
                <input 
                  type="number" 
                  className="premium-input w-full pr-14 text-xl"
                  value={targetROI}
                  onChange={(e) => setTargetROI(Number(e.target.value))}
                />
              </div>
            </div>
          </div>



          <div className="space-y-6 pt-6">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Ajuste Rápido de ROI</h4>
              <span className="text-2xl font-black text-primary tracking-tighter">{targetROI}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="200" 
              step="5"
              className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
              value={targetROI}
              onChange={(e) => setTargetROI(Number(e.target.value))}
            />
          </div>
        </Card>

        {/* Dynamic Results Card */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
          <Card className="p-10 bg-primary/5 border-primary/20 shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden group">
            <div className="relative z-10 space-y-12">
              <div>
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Resultado Sugerido</h3>
                <p className="text-[10px] font-black text-muted uppercase tracking-widest opacity-60 mb-2">Preço de Venda Final</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-7xl font-black text-white tracking-tighter">
                    R$ {sellingPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/10">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">Lucro Neto</p>
                  <p className="text-2xl font-black text-white tracking-tighter">R$ {profit.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-amber-500/10 rounded-3xl border border-amber-500/10">
                  <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2">Margem Líquida</p>
                  <p className="text-2xl font-black text-white tracking-tighter">{margin.toFixed(1)}%</p>
                </div>
              </div>

              <div className="space-y-4 pt-10 border-t border-white/5">
                <div className="flex justify-between items-center text-sm font-bold text-muted">
                  <span>Custo Operacional Total</span>
                  <span className="text-white">R$ {purchasePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-muted">
                  <span>Break-even Estimado</span>
                  <span className="text-white">R$ {purchasePrice.toLocaleString()}</span>
                </div>
              </div>

              <Button onClick={() => setIsModalOpen(true)} className="w-full h-20 text-xl font-black shadow-primary/30">
                <Save size={24} strokeWidth={3} />
                Converter em Ativo
              </Button>
            </div>
            
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[80px] translate-y-1/2 -translate-x-1/2 rounded-full" />
          </Card>

          <Card className="p-8 bg-white/[0.02] border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                <TrendingUp size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">Estratégias de ROI</h4>
                <p className="text-xs font-bold text-muted">Consulte benchmarks do mercado</p>
              </div>
            </div>
            <ChevronRight className="text-muted group-hover:translate-x-2 transition-transform" />
          </Card>
        </div>
      </div>

      <AddBrickModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={{ purchasePrice }}
      />
    </div>
  );
};

export default Calculator;
