import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { Button, Card } from '../ui/Common';
import { useBricks } from '../../context/BrickContext';
import type { Brick } from '../../data/mockData';

export const EditBrickModal = ({ isOpen, onClose, brick }: { isOpen: boolean, onClose: () => void, brick: Brick | null }) => {
  const { updateBrick } = useBricks();
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Apple',
    model: '',
    storage: '128GB',
    color: '',
    condition: 'Excelente' as Brick['condition'],
    batteryHealth: '100',
    defect: '',
    purchasePrice: '',
    maintenanceCost: '0',
    shippingCost: '0',
    additionalCosts: '0',
    status: 'In Stock' as Brick['status'],
    image: ''
  });

  useEffect(() => {
    if (brick && isOpen) {
      setFormData({
        name: brick.name,
        brand: brick.brand,
        model: brick.model,
        storage: brick.storage,
        color: brick.color,
        condition: brick.condition,
        batteryHealth: (brick.batteryHealth ?? 100).toString(),
        defect: brick.defect || '',
        purchasePrice: brick.purchasePrice.toString(),
        maintenanceCost: brick.maintenanceCost.toString(),
        shippingCost: brick.shippingCost.toString(),
        additionalCosts: brick.additionalCosts.toString(),
        status: brick.status,
        image: brick.image
      });
    }
  }, [brick, isOpen]);

  if (!isOpen || !brick) return null;

  const totalInvested = (Number(formData.purchasePrice) || 0) + (Number(formData.maintenanceCost) || 0) + (Number(formData.shippingCost) || 0) + (Number(formData.additionalCosts) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrick(brick.id, {
      name: formData.name,
      brand: formData.brand,
      model: formData.model,
      storage: formData.storage,
      color: formData.color,
      condition: formData.condition,
      batteryHealth: Number(formData.batteryHealth),
      defect: formData.defect || undefined,
      purchasePrice: Number(formData.purchasePrice),
      maintenanceCost: Number(formData.maintenanceCost),
      shippingCost: Number(formData.shippingCost),
      additionalCosts: Number(formData.additionalCosts),
      totalInvested,
      status: formData.status,
      image: formData.image
    });
    onClose();
  };

  const inputClass = "premium-input w-full";
  const labelClass = "text-[10px] font-black text-muted uppercase tracking-[0.2em]";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <Card className="w-full max-w-2xl p-10 space-y-8 my-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400">
              <Edit3 size={24} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter">Editar <span className="text-amber-400">Aparelho</span></h2>
          </div>
          <button onClick={onClose} className="p-2 text-muted hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Marca</label>
              <select className={`${inputClass} appearance-none`} value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})}>
                <option>Apple</option>
                <option>Samsung</option>
                <option>Xiaomi</option>
                <option>Motorola</option>
                <option>Outros</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Modelo</label>
              <input required className={inputClass} value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Armazenamento</label>
              <select className={`${inputClass} appearance-none`} value={formData.storage} onChange={e => setFormData({...formData, storage: e.target.value})}>
                <option>32GB</option><option>64GB</option><option>128GB</option><option>256GB</option><option>512GB</option><option>1TB</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Cor</label>
              <input className={inputClass} value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Condição</label>
              <select className={`${inputClass} appearance-none`} value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value as Brick['condition']})}>
                <option>Novo</option><option>Excelente</option><option>Bom</option><option>Com Marcas</option><option>Quebrado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Saúde Bateria (%)</label>
              <input type="number" min="0" max="100" className={inputClass} value={formData.batteryHealth} onChange={e => setFormData({...formData, batteryHealth: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Defeito</label>
              <input className={inputClass} value={formData.defect} onChange={e => setFormData({...formData, defect: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Status</label>
              <select className={`${inputClass} appearance-none`} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as Brick['status']})}>
                <option value="In Stock">Disponível</option>
                <option value="Reserved">Reservado</option>
                <option value="In Maintenance">Em Manutenção</option>
                <option value="Sold">Vendido</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Preço de Compra</label>
              <input required type="number" className={inputClass} value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Manutenção</label>
              <input type="number" className={inputClass} value={formData.maintenanceCost} onChange={e => setFormData({...formData, maintenanceCost: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Frete</label>
              <input type="number" className={inputClass} value={formData.shippingCost} onChange={e => setFormData({...formData, shippingCost: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Custos Adicionais</label>
              <input type="number" className={inputClass} value={formData.additionalCosts} onChange={e => setFormData({...formData, additionalCosts: e.target.value})} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 flex justify-between items-center">
            <span className="text-sm font-bold text-muted">Total Investido</span>
            <span className="text-2xl font-black text-amber-400">R$ {totalInvested.toLocaleString()}</span>
          </div>

          <Button type="submit" className="w-full py-5 text-lg font-black uppercase tracking-widest mt-4">
            <Save size={20} strokeWidth={3} />
            Salvar Alterações
          </Button>
        </form>
      </Card>
    </div>
  );
};
