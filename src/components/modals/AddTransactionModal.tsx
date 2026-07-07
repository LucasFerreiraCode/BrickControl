import React, { useState } from 'react';
import { X, Save, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Button, Card } from '../ui/Common';
import { useBricks } from '../../context/BrickContext';
import { motion, AnimatePresence } from 'framer-motion';

export const AddTransactionModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { addTransaction } = useBricks();
  const [formData, setFormData] = useState({
    type: 'Out' as const,
    description: '',
    value: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.value) return;
    
    addTransaction({
      type: formData.type,
      description: formData.description,
      value: Number(formData.value),
      date: formData.date
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
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Cash Flow Control</p>
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none">Novo <span className="text-primary">Lançamento</span></h2>
            </div>
            <button onClick={onClose} className="p-3 text-muted hover:text-white hover:bg-white/5 rounded-2xl transition-all">
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Type Selector Dashboard */}
            <div className="flex bg-white/[0.03] border border-white/5 rounded-[2rem] p-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'In'})}
                className={`flex-1 flex flex-col items-center gap-2 py-6 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                  formData.type === 'In' 
                  ? 'bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20' 
                  : 'text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp size={24} strokeWidth={3} />
                Entrada / Receita
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'Out'})}
                className={`flex-1 flex flex-col items-center gap-2 py-6 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                  formData.type === 'Out' 
                  ? 'bg-rose-500 text-white shadow-2xl shadow-rose-500/20' 
                  : 'text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingDown size={24} strokeWidth={3} />
                Saída / Despesa
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Descrição Detalhada</label>
              <input 
                required
                autoFocus
                className="premium-input w-full"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Ex: Pagamento Fornecedor, Upgrade de Setup..."
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Valor Monetário</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black">R$</span>
                  <input 
                    required
                    type="number"
                    className="premium-input w-full pl-14"
                    value={formData.value}
                    onChange={e => setFormData({...formData, value: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Data de Registro</label>
                <input 
                  required
                  type="date"
                  className="premium-input w-full"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-20 text-xl font-black uppercase tracking-tighter mt-4 shadow-primary/30">
              <Save size={24} strokeWidth={3} />
              Confirmar Transação
            </Button>
          </form>
          
          {/* Background decorative glow */}
          <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full opacity-20 ${
            formData.type === 'In' ? 'bg-emerald-500' : 'bg-rose-500'
          }`} />
        </Card>
      </motion.div>
    </div>
  );
};
