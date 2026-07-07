import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button, Card } from '../ui/Common';
import { useBricks } from '../../context/BrickContext';
import type { Brick } from '../../data/mockData';

export const EditBrickModal = ({ isOpen, onClose, brick }: { isOpen: boolean, onClose: () => void, brick: Brick | null }) => {
  const { updateBrick } = useBricks();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Eletrônicos',
    purchasePrice: '',
    fees: '0',
    shipping: '0',
    status: 'In Stock' as const,
    image: ''
  });

  useEffect(() => {
    if (brick) {
      setFormData({
        name: brick.name,
        category: brick.category,
        purchasePrice: brick.purchasePrice.toString(),
        fees: brick.fees.toString(),
        shipping: brick.shipping.toString(),
        status: brick.status,
        image: brick.image
      });
    }
  }, [brick]);

  if (!isOpen || !brick) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrick(brick.id, {
      name: formData.name,
      category: formData.category,
      purchasePrice: Number(formData.purchasePrice),
      fees: Number(formData.fees),
      shipping: Number(formData.shipping),
      status: formData.status,
      image: formData.image
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-lg p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Editar Brick</h2>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Nome do Produto</label>
            <input 
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Preço de Compra</label>
              <input 
                required
                type="number"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                value={formData.purchasePrice}
                onChange={e => setFormData({...formData, purchasePrice: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Categoria</label>
              <select 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option>Eletrônicos</option>
                <option>Games</option>
                <option>Acessórios</option>
                <option>Colecionáveis</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Taxas</label>
              <input 
                type="number"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                value={formData.fees}
                onChange={e => setFormData({...formData, fees: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Frete</label>
              <input 
                type="number"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                value={formData.shipping}
                onChange={e => setFormData({...formData, shipping: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Status</label>
              <select 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="In Stock">Em Estoque</option>
                <option value="Reserved">Reservado</option>
                <option value="Sold">Vendido</option>
              </select>
            </div>

          <Button type="submit" className="w-full py-4 mt-4">
            <Save size={20} />
            Salvar Alterações
          </Button>
        </form>
      </Card>
    </div>
  );
};
