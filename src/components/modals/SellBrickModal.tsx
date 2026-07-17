import React, { useState } from 'react';
import { X, Save, DollarSign } from 'lucide-react';
import { Button, Card } from '../ui/Common';
import { useBricks } from '../../context/BrickContext';
import type { Brick } from '../../data/mockData';

export const SellBrickModal = ({ isOpen, onClose, brick }: { isOpen: boolean, onClose: () => void, brick: Brick | null }) => {
  const { sellBrick } = useBricks();
  const [formData, setFormData] = useState({
    salePrice: '',
    saleDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Pix' as Brick['paymentMethod'],
    commission: '0',
    saleFees: '0',
    saleShipping: '0',
    client: '',
    observations: ''
  });

  if (!isOpen || !brick) return null;

  const salePrice = Number(formData.salePrice) || 0;
  const commission = Number(formData.commission) || 0;
  const saleFees = Number(formData.saleFees) || 0;
  const saleShipping = Number(formData.saleShipping) || 0;
  const totalCosts = commission + saleFees + saleShipping;
  const lucroLiquido = salePrice - brick.totalInvested - totalCosts;
  const margem = salePrice > 0 ? ((lucroLiquido / salePrice) * 100).toFixed(1) : '0';
  const roi = brick.totalInvested > 0 ? ((lucroLiquido / brick.totalInvested) * 100).toFixed(1) : '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.salePrice) return;
    sellBrick(
      brick.id,
      salePrice,
      formData.saleDate,
      formData.paymentMethod,
      commission,
      saleFees,
      saleShipping,
      formData.client,
      formData.observations
    );
    onClose();
  };

  const inputClass = "premium-input w-full";
  const labelClass = "text-[10px] font-black text-muted uppercase tracking-[0.2em]";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <Card className="w-full max-w-xl p-10 space-y-8 my-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-400/10 rounded-2xl flex items-center justify-center text-emerald-400">
              <DollarSign size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter">Registrar <span className="text-emerald-400">Venda</span></h2>
              <p className="text-xs text-muted font-bold">{brick.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Valor de Venda</label>
              <input required type="number" className={inputClass} value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: e.target.value})} placeholder="R$ 0" />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Data da Venda</label>
              <input type="date" className={inputClass} value={formData.saleDate} onChange={e => setFormData({...formData, saleDate: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Forma de Pagamento</label>
              <select className={`${inputClass} appearance-none`} value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value as Brick['paymentMethod']})}>
                <option>Pix</option>
                <option>Cartão</option>
                <option>Dinheiro</option>
                <option>Outro</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Comissão</label>
              <input type="number" className={inputClass} value={formData.commission} onChange={e => setFormData({...formData, commission: e.target.value})} placeholder="R$ 0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Taxas</label>
              <input type="number" className={inputClass} value={formData.saleFees} onChange={e => setFormData({...formData, saleFees: e.target.value})} placeholder="R$ 0" />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Frete de Envio</label>
              <input type="number" className={inputClass} value={formData.saleShipping} onChange={e => setFormData({...formData, saleShipping: e.target.value})} placeholder="R$ 0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Cliente (Opcional)</label>
              <input className={inputClass} value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} placeholder="Nome do cliente" />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Observações</label>
              <input className={inputClass} value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} placeholder="Notas adicionais" />
            </div>
          </div>

          {/* Resultado da Venda */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4">
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Resumo da Negociação</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Lucro Líquido</p>
                <p className={`text-xl font-black ${lucroLiquido >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {lucroLiquido.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Margem</p>
                <p className={`text-xl font-black ${Number(margem) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {margem}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">ROI</p>
                <p className={`text-xl font-black ${Number(roi) >= 0 ? 'text-primary' : 'text-rose-400'}`}>
                  {roi}%
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full py-5 text-lg font-black uppercase tracking-widest mt-4 bg-emerald-500 hover:bg-emerald-600">
            <Save size={20} strokeWidth={3} />
            Confirmar Venda
          </Button>
        </form>
      </Card>
    </div>
  );
};
