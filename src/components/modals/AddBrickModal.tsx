import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button, Card } from '../ui/Common';
import { useBricks } from '../../context/BrickContext';

export const AddBrickModal = ({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: any }) => {
  const { addBrick } = useBricks();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Eletrônicos',
    purchasePrice: '',
    fees: '0',
    shipping: '0',
    status: 'In Stock' as const,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60'
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        purchasePrice: initialData.purchasePrice?.toString() || prev.purchasePrice,
        fees: initialData.fees?.toString() || prev.fees,
        shipping: initialData.shipping?.toString() || prev.shipping,
      }));
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBrick({
      name: formData.name,
      category: formData.category,
      purchasePrice: Number(formData.purchasePrice),
      fees: Number(formData.fees),
      shipping: Number(formData.shipping),
      status: formData.status,
      image: formData.image,
      purchaseDate: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <Card className="w-full max-w-lg p-10 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-white tracking-tighter">Novo <span className="text-primary">Brick</span></h2>
          <button onClick={onClose} className="p-2 text-muted hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Nome do Produto</label>
            <input 
              required
              className="premium-input w-full"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: iPhone 13 128GB"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Preço de Compra</label>
              <input 
                required
                type="number"
                className="premium-input w-full"
                value={formData.purchasePrice}
                onChange={e => setFormData({...formData, purchasePrice: e.target.value})}
                placeholder="R$ 0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Categoria</label>
              <select 
                className="premium-input w-full appearance-none"
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

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Taxas</label>
              <input 
                type="number"
                className="premium-input w-full"
                value={formData.fees}
                onChange={e => setFormData({...formData, fees: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Frete</label>
              <input 
                type="number"
                className="premium-input w-full"
                value={formData.shipping}
                onChange={e => setFormData({...formData, shipping: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-5 text-lg font-black uppercase tracking-widest mt-4">
            <Save size={20} strokeWidth={3} />
            Efetuar Registro
          </Button>
        </form>
      </Card>
    </div>
  );
};
