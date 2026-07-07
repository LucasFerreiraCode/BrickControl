import React, { useState } from 'react';
import { X, Target, Save, ShieldCheck } from 'lucide-react';
import { Button, Card } from '../ui/Common';
import { useBricks } from '../../context/BrickContext';
import { motion } from 'framer-motion';

export const AddGoalModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { addGoal } = useBricks();
  const [formData, setFormData] = useState({
    title: '',
    target: '',
    current: '0',
    type: 'Profit' as const
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.target) return;

    addGoal({
      title: formData.title,
      target: Number(formData.target),
      current: Number(formData.current),
      type: formData.type
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="p-10 space-y-10 relative overflow-hidden">
          <div className="flex justify-between items-center relative z-10">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Strategic Planning</p>
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none">Nova <span className="text-primary italic">Meta</span></h2>
            </div>
            <button onClick={onClose} className="p-3 text-muted hover:text-white hover:bg-white/5 rounded-2xl transition-all">
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Título da Conquista</label>
              <input 
                required
                autoFocus
                className="premium-input w-full"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Meta R$ 10k de Lucro no Mês..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Valor Alvo (R$)</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black">R$</span>
                  <input 
                    required
                    type="number"
                    className="premium-input w-full pl-14"
                    value={formData.target}
                    onChange={e => setFormData({...formData, target: e.target.value})}
                    placeholder="20,000"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Tipo de Objetivo</label>
                <select 
                  className="premium-input w-full appearance-none"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="Profit">Lucro Líquido</option>
                  <option value="Revenue">Faturamento Bruto</option>
                  <option value="Capital">Capital Alocado</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <ShieldCheck size={24} />
              </div>
              <p className="text-xs font-bold text-slate-300 leading-tight">
                Acompanharemos seu progresso <span className="text-white font-black italic">automaticamente</span> baseado nos seus lançamentos.
              </p>
            </div>

            <Button type="submit" className="w-full h-20 text-xl font-black uppercase tracking-tighter mt-4 shadow-primary/30">
              <Target size={24} strokeWidth={3} className="mr-2" />
              Estabelecer Objetivo
            </Button>
          </form>
          
          {/* Background decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full opacity-20" />
        </Card>
      </motion.div>
    </div>
  );
};
