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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <Card className="w-full max-w-md p-10 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-white tracking-tighter">Vender <span className="text-primary">Brick</span></h2>
          <button onClick={onClose} className="p-2 text-muted hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 relative overflow-hidden group">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Item em Venda</p>
          <h3 className="text-xl font-black text-white mb-1">{brick.name}</h3>
          <p className="text-sm font-bold text-muted">Custo total: <span className="text-white">R$ {(brick.purchasePrice + brick.fees + brick.shipping).toLocaleString()}</span></p>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/10 blur-2xl rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Preço Final de Venda</label>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black">R$</span>
              <input 
                required
                autoFocus
                type="number"
                className="premium-input w-full pl-14"
                value={salePrice}
                onChange={e => setSalePrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Data da Transação</label>
            <input 
              required
              type="date"
              className="premium-input w-full"
              value={saleDate}
              onChange={e => setSaleDate(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full py-5 text-lg font-black uppercase tracking-widest mt-4 bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20">
            <DollarSign size={22} strokeWidth={3} />
            Confirmar Venda
          </Button>
        </form>
      </Card>
    </div>
  );
};
