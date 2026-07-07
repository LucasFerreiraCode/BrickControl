import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Button, Card } from '../ui/Common';
import { useBricks } from '../../context/BrickContext';
import type { Brick } from '../../data/mockData';

export const SellBrickModal = ({ isOpen, onClose, brick }: { isOpen: boolean, onClose: () => void, brick: Brick | null }) => {
  const { sellBrick } = useBricks();
  const [salePrice, setSalePrice] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen || !brick) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sellBrick(brick.id, Number(salePrice), saleDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Vender Brick</h2>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-4">
          <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Produto</p>
          <h3 className="text-lg font-bold text-white">{brick.name}</h3>
          <p className="text-sm text-muted">Custo total: R$ {(brick.purchasePrice + brick.fees + brick.shipping).toLocaleString()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Preço de Venda</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">R$</span>
              <input 
                required
                autoFocus
                type="number"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                value={salePrice}
                onChange={e => setSalePrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Data da Venda</label>
            <input 
              required
              type="date"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
              value={saleDate}
              onChange={e => setSaleDate(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full py-4 mt-4 bg-success hover:bg-success/90">
            <DollarSign size={20} />
            Confirmar Venda
          </Button>
        </form>
      </Card>
    </div>
  );
};
