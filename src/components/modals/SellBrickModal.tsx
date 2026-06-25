import React, { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { Button, Card } from '../ui/Common';
import { useBricks } from '../../context/BrickContext';

export const SellBrickModal = ({ isOpen, onClose, brickId, brickName }: { isOpen: boolean, onClose: () => void, brickId: string, brickName: string }) => {
  const { sellBrick } = useBricks();
  const [salePrice, setSalePrice] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sellBrick(brickId, Number(salePrice), new Date().toISOString());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-sm p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Vender Produto</h2>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <p className="text-muted text-sm italic">Confirmando a venda de: <span className="text-white font-bold">{brickName}</span></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Preço de Venda Final</label>
            <input 
              required
              type="number"
              autoFocus
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none text-xl font-bold"
              value={salePrice}
              onChange={e => setSalePrice(e.target.value)}
              placeholder="R$ 0.00"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full py-4 mt-4">
            <TrendingUp size={20} />
            Confirmar e Registrar Lucro
          </Button>
        </form>
      </Card>
    </div>
  );
};
