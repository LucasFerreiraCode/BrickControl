import { useState } from 'react';
import { Calculator as CalcIcon, TrendingUp, AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui/Common';
import { motion } from 'framer-motion';

const Calculator = () => {
  const [form, setForm] = useState({
    purchasePrice: '',
    batteryReplace: '0',
    screenReplace: '0',
    shipping: '0',
    otherCosts: '0',
    expectedSalePrice: '',
  });

  const purchase = Number(form.purchasePrice) || 0;
  const battery = Number(form.batteryReplace) || 0;
  const screen = Number(form.screenReplace) || 0;
  const shipping = Number(form.shipping) || 0;
  const other = Number(form.otherCosts) || 0;
  const sale = Number(form.expectedSalePrice) || 0;

  const totalInvestment = purchase + battery + screen + shipping + other;
  const estimatedProfit = sale - totalInvestment;
  const margin = sale > 0 ? ((estimatedProfit / sale) * 100).toFixed(1) : '0';
  const roi = totalInvestment > 0 ? ((estimatedProfit / totalInvestment) * 100).toFixed(1) : '0';

  const getVerdict = () => {
    if (!purchase || !sale) return { text: 'Preencha os valores de compra e venda estimada para ver a análise.', color: 'text-muted', type: 'neutral' };
    const m = Number(margin);
    if (m >= 25) return { text: `Excelente negociação! Margem de ${margin}% é acima da média do mercado. Vale muito a pena!`, color: 'text-emerald-400', type: 'success' };
    if (m >= 15) return { text: `Boa margem de ${margin}%. Negociação sólida, prossiga com confiança.`, color: 'text-emerald-400', type: 'success' };
    if (m >= 5) return { text: `Margem de ${margin}% é aceitável, mas considere negociar um valor menor na compra ou buscar outro aparelho com melhor potencial.`, color: 'text-amber-400', type: 'warning' };
    if (m >= 0) return { text: `Margem muito baixa de apenas ${margin}%. Essa negociação apresenta alto risco. Recomendo buscar um preço de compra menor.`, color: 'text-amber-400', type: 'warning' };
    return { text: `PREJUÍZO de R$ ${Math.abs(estimatedProfit).toLocaleString()}. Essa negociação não compensa. Busque outro aparelho ou negocie valores melhores.`, color: 'text-rose-400', type: 'danger' };
  };

  const verdict = getVerdict();
  const inputClass = "premium-input w-full";
  const labelClass = "text-[10px] font-black text-muted uppercase tracking-[0.2em]";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <header className="pb-6 border-b border-white/5">
        <Badge variant="blue">Ferramenta</Badge>
        <h1 className="text-6xl font-black tracking-tighter text-white mt-2">
          Simulador <span className="text-primary italic">Inteligente</span>
        </h1>
        <p className="text-muted text-xl font-medium tracking-tight mt-2">Simule a lucratividade de uma negociação antes de comprar.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <Card className="lg:col-span-7 p-10 bg-slate-900/40 space-y-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <CalcIcon size={24} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tighter">Dados da Negociação</h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Valor de Compra</label>
              <input type="number" className={inputClass} value={form.purchasePrice} onChange={e => setForm({...form, purchasePrice: e.target.value})} placeholder="R$ 0" />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Troca de Bateria</label>
              <input type="number" className={inputClass} value={form.batteryReplace} onChange={e => setForm({...form, batteryReplace: e.target.value})} placeholder="R$ 0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Troca de Tela</label>
              <input type="number" className={inputClass} value={form.screenReplace} onChange={e => setForm({...form, screenReplace: e.target.value})} placeholder="R$ 0" />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Frete</label>
              <input type="number" className={inputClass} value={form.shipping} onChange={e => setForm({...form, shipping: e.target.value})} placeholder="R$ 0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Outros Custos</label>
              <input type="number" className={inputClass} value={form.otherCosts} onChange={e => setForm({...form, otherCosts: e.target.value})} placeholder="R$ 0" />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Valor Estimado de Venda</label>
              <input type="number" className={inputClass} value={form.expectedSalePrice} onChange={e => setForm({...form, expectedSalePrice: e.target.value})} placeholder="R$ 0" />
            </div>
          </div>
        </Card>

        {/* Result Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-10 bg-slate-900/60 space-y-8">
            <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
              <TrendingUp size={22} className="text-primary" />
              Resultado da Simulação
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-2">Investimento Total</p>
                <p className="text-2xl font-black text-white">R$ {totalInvestment.toLocaleString()}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-2">Venda Esperada</p>
                <p className="text-2xl font-black text-white">R$ {sale.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Lucro Estimado</p>
                <p className={`text-xl font-black ${estimatedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {estimatedProfit.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Margem</p>
                <p className={`text-xl font-black ${Number(margin) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {margin}%
                </p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">ROI</p>
                <p className={`text-xl font-black ${Number(roi) >= 0 ? 'text-primary' : 'text-rose-400'}`}>
                  {roi}%
                </p>
              </div>
            </div>

            {/* Progress */}
            {totalInvestment > 0 && sale > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black text-muted uppercase tracking-widest">
                  <span>Margem de Lucro</span>
                  <span className={estimatedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{margin}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, Math.min(Number(margin), 100))}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${Number(margin) >= 15 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : Number(margin) >= 5 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-rose-500 to-rose-400'}`}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* AI Verdict */}
          <Card className={`p-8 border ${verdict.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' : verdict.type === 'warning' ? 'bg-amber-500/5 border-amber-500/10' : verdict.type === 'danger' ? 'bg-rose-500/5 border-rose-500/10' : 'bg-white/[0.02] border-white/5'}`}>
            <div className="flex items-start gap-3">
              <Sparkles size={20} className={verdict.color} />
              <div>
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-2">Análise Inteligente</p>
                <p className={`text-sm font-medium leading-relaxed ${verdict.color}`}>
                  {verdict.text}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Calculator;
