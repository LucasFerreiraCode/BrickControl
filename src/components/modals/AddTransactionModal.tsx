import { useState } from 'react';
import { X, Save, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Button, Card } from '../ui/Common';
import { useBricks } from '../../context/BrickContext';
import { motion } from 'framer-motion';

export const AddTransactionModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { addTransaction } = useBricks();
  const [formData, setFormData] = useState<{
    type: 'In' | 'Out';
    description: string;
    value: string;
    date: string;
  }>({
    type: 'Out',
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
      date: formData.date,
    });

    setFormData({ type: 'Out', description: '', value: '', date: new Date().toISOString().split('T')[0] });
    onClose();
  };

  const inputClass = "premium-input w-full";
  const labelClass = "text-[10px] font-black text-muted uppercase tracking-[0.2em]";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <Card className="w-full max-w-lg p-10 space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <DollarSign size={24} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter">Nova <span className="text-primary">Transação</span></h2>
          </div>
          <button onClick={onClose} className="p-2 text-muted hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Toggle */}
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'In'})}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                formData.type === 'In' ? 'bg-emerald-500 text-white shadow-xl' : 'text-muted hover:text-white'
              }`}
            >
              <TrendingUp size={18} />
              Entrada
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'Out'})}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                formData.type === 'Out' ? 'bg-rose-500 text-white shadow-xl' : 'text-muted hover:text-white'
              }`}
            >
              <TrendingDown size={18} />
              Saída
            </button>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Descrição</label>
            <input
              required
              className={inputClass}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Ex: Compra iPhone 13 Pro"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Valor (R$)</label>
              <input
                required
                type="number"
                className={inputClass}
                value={formData.value}
                onChange={e => setFormData({...formData, value: e.target.value})}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Data</label>
              <input
                type="date"
                className={inputClass}
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-5 text-lg font-black uppercase tracking-widest mt-4">
            <Save size={20} strokeWidth={3} />
            Registrar Transação
          </Button>
        </form>
      </Card>
    </div>
  );
};
