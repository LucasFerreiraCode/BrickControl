import React, { useState, useEffect } from 'react';
import { X, Save, Smartphone } from 'lucide-react';
import { Button, Card } from '../ui/Common';
import { useBricks } from '../../context/BrickContext';
import type { Brick } from '../../data/mockData';

export const AddBrickModal = ({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: any }) => {
  const { addBrick } = useBricks();
  const [formData, setFormData] = useState({
    brand: 'Apple',
    model: '',
    name: '',
    storage: '128GB',
    color: '',
    imei: '',
    condition: 'Excelente' as Brick['condition'],
    batteryHealth: '100',
    defect: '',
    accessories: [] as string[],
    purchasePrice: '',
    maintenanceCost: '0',
    shippingCost: '0',
    additionalCosts: '0',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60'
  });

  const accessoryOptions = ['Carregador', 'Cabo', 'Caixa', 'Fone', 'Película', 'Capinha', 'Caneta S-Pen'];

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        purchasePrice: initialData.purchasePrice?.toString() || prev.purchasePrice,
        maintenanceCost: initialData.maintenanceCost?.toString() || prev.maintenanceCost,
        shippingCost: initialData.shippingCost?.toString() || prev.shippingCost,
        additionalCosts: initialData.additionalCosts?.toString() || prev.additionalCosts,
        batteryHealth: initialData.batteryHealth?.toString() || prev.batteryHealth,
      }));
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleAccessory = (acc: string) => {
    setFormData(prev => ({
      ...prev,
      accessories: prev.accessories.includes(acc)
        ? prev.accessories.filter(a => a !== acc)
        : [...prev.accessories, acc]
    }));
  };

  const purchasePrice = Number(formData.purchasePrice) || 0;
  const maintenanceCost = Number(formData.maintenanceCost) || 0;
  const shippingCost = Number(formData.shippingCost) || 0;
  const additionalCosts = Number(formData.additionalCosts) || 0;
  const totalInvested = purchasePrice + maintenanceCost + shippingCost + additionalCosts;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const autoName = `${formData.brand} ${formData.model} ${formData.storage} - ${formData.color}`.trim();
    addBrick({
      brand: formData.brand,
      model: formData.model,
      name: formData.name || autoName,
      storage: formData.storage,
      color: formData.color,
      imei: formData.imei || undefined,
      condition: formData.condition,
      batteryHealth: Number(formData.batteryHealth) || undefined,
      defect: formData.defect || undefined,
      accessories: formData.accessories,
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice,
      maintenanceCost,
      shippingCost,
      additionalCosts,
      totalInvested,
      status: 'In Stock',
      image: formData.image,
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
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Smartphone size={24} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter">Novo <span className="text-primary">Aparelho</span></h2>
          </div>
          <button onClick={onClose} className="p-2 text-muted hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Marca & Modelo */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Marca</label>
              <select
                className={`${inputClass} appearance-none`}
                value={formData.brand}
                onChange={e => setFormData({...formData, brand: e.target.value})}
              >
                <option>Apple</option>
                <option>Samsung</option>
                <option>Xiaomi</option>
                <option>Motorola</option>
                <option>Outros</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Modelo</label>
              <input
                required
                className={inputClass}
                value={formData.model}
                onChange={e => setFormData({...formData, model: e.target.value})}
                placeholder="Ex: iPhone 13 Pro"
              />
            </div>
          </div>

          {/* Armazenamento, Cor, Condição */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Armazenamento</label>
              <select
                className={`${inputClass} appearance-none`}
                value={formData.storage}
                onChange={e => setFormData({...formData, storage: e.target.value})}
              >
                <option>32GB</option>
                <option>64GB</option>
                <option>128GB</option>
                <option>256GB</option>
                <option>512GB</option>
                <option>1TB</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Cor</label>
              <input
                className={inputClass}
                value={formData.color}
                onChange={e => setFormData({...formData, color: e.target.value})}
                placeholder="Ex: Preto"
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Condição</label>
              <select
                className={`${inputClass} appearance-none`}
                value={formData.condition}
                onChange={e => setFormData({...formData, condition: e.target.value as Brick['condition']})}
              >
                <option>Novo</option>
                <option>Excelente</option>
                <option>Bom</option>
                <option>Com Marcas</option>
                <option>Quebrado</option>
              </select>
            </div>
          </div>

          {/* Bateria, IMEI, Defeito */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Saúde Bateria (%)</label>
              <input
                type="number"
                min="0" max="100"
                className={inputClass}
                value={formData.batteryHealth}
                onChange={e => setFormData({...formData, batteryHealth: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>IMEI (Opcional)</label>
              <input
                className={inputClass}
                value={formData.imei}
                onChange={e => setFormData({...formData, imei: e.target.value})}
                placeholder="000000000000000"
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Defeito</label>
              <input
                className={inputClass}
                value={formData.defect}
                onChange={e => setFormData({...formData, defect: e.target.value})}
                placeholder="Nenhum"
              />
            </div>
          </div>

          {/* Acessórios */}
          <div className="space-y-2">
            <label className={labelClass}>Acessórios Inclusos</label>
            <div className="flex flex-wrap gap-2">
              {accessoryOptions.map(acc => (
                <button
                  key={acc}
                  type="button"
                  onClick={() => toggleAccessory(acc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    formData.accessories.includes(acc)
                      ? 'bg-primary/20 border-primary/40 text-primary'
                      : 'bg-white/5 border-white/10 text-muted hover:text-white'
                  }`}
                >
                  {acc}
                </button>
              ))}
            </div>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Preço de Compra</label>
              <input
                required
                type="number"
                className={inputClass}
                value={formData.purchasePrice}
                onChange={e => setFormData({...formData, purchasePrice: e.target.value})}
                placeholder="R$ 0"
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Manutenção</label>
              <input
                type="number"
                className={inputClass}
                value={formData.maintenanceCost}
                onChange={e => setFormData({...formData, maintenanceCost: e.target.value})}
                placeholder="R$ 0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Frete</label>
              <input
                type="number"
                className={inputClass}
                value={formData.shippingCost}
                onChange={e => setFormData({...formData, shippingCost: e.target.value})}
                placeholder="R$ 0"
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Custos Adicionais</label>
              <input
                type="number"
                className={inputClass}
                value={formData.additionalCosts}
                onChange={e => setFormData({...formData, additionalCosts: e.target.value})}
                placeholder="R$ 0"
              />
            </div>
          </div>

          {/* Total Investido */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex justify-between items-center">
            <span className="text-sm font-bold text-muted">Total Investido</span>
            <span className="text-2xl font-black text-primary">R$ {totalInvested.toLocaleString()}</span>
          </div>

          <Button type="submit" className="w-full py-5 text-lg font-black uppercase tracking-widest mt-4">
            <Save size={20} strokeWidth={3} />
            Cadastrar Aparelho
          </Button>
        </form>
      </Card>
    </div>
  );
};
