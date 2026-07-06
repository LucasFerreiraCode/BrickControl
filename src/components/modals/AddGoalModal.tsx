import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { Button, Card } from '../ui/Common';
import { useBricks } from '../../context/BrickContext';

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
    addGoal({
      title: formData.title,
      target: Number(formData.target),
      current: Number(formData.current),
      type: formData.type
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Nova Meta</h2>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Título da Meta</label>
            <input 
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Liberdade Financeira, Novo Setup..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Valor Alvo (R$)</label>
              <input 
                required
                type="number"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                value={formData.target}
                onChange={e => setFormData({...formData, target: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Tipo</label>
              <select 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="Profit">Lucro</option>
                <option value="Revenue">Faturamento</option>
                <option value="Capital">Capital</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Valor Inicial (Opcional)</label>
            <input 
              type="number"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
              value={formData.current}
              onChange={e => setFormData({...formData, current: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full py-4 mt-4">
            <Target size={20} />
            Criar Meta
          </Button>
        </form>
      </Card>
    </div>
  );
};
