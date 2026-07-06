import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Button, Card } from '../ui/Common';
import { useBricks } from '../../context/BrickContext';

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
    addTransaction({
      type: formData.type,
      description: formData.description,
      value: Number(formData.value),
      date: formData.date
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Novo Lançamento</h2>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'In'})}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                formData.type === 'In' ? 'bg-success text-white shadow-md' : 'text-muted hover:text-white'
              }`}
            >
              Entrada
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'Out'})}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                formData.type === 'Out' ? 'bg-danger text-white shadow-md' : 'text-muted hover:text-white'
              }`}
            >
              Saída
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Descrição</label>
            <input 
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Ex: Compra de lote, Luz, Aluguel..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Valor (R$)</label>
              <input 
                required
                type="number"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                value={formData.value}
                onChange={e => setFormData({...formData, value: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Data</label>
              <input 
                required
                type="date"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-4 mt-4">
            <Save size={20} />
            Confirmar Lançamento
          </Button>
        </form>
      </Card>
    </div>
  );
};
