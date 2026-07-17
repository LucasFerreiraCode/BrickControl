import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  Package, 
  Trash2, 
  Edit3, 
  CheckCircle,
  Tag,
  Battery,
  Smartphone,
  Wrench
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';
import { AddBrickModal } from '../components/modals/AddBrickModal';
import { EditBrickModal } from '../components/modals/EditBrickModal';
import { SellBrickModal } from '../components/modals/SellBrickModal';
import type { Brick } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const Inventory = () => {
  const { bricks, deleteBrick } = useBricks();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedBrick, setSelectedBrick] = useState<Brick | null>(null);

  const filteredBricks = bricks.filter(brick => {
    const matchesFilter = filter === 'All' || brick.status === filter;
    const matchesSearch = brick.name.toLowerCase().includes(search.toLowerCase()) || brick.model.toLowerCase().includes(search.toLowerCase()) || brick.brand.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleEdit = (brick: Brick) => {
    setSelectedBrick(brick);
    setIsEditModalOpen(true);
  };

  const handleSell = (brick: Brick) => {
    setSelectedBrick(brick);
    setIsSellModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este aparelho?')) {
      deleteBrick(id);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  const getBatteryColor = (health?: number) => {
    if (!health) return 'text-muted';
    if (health >= 90) return 'text-emerald-400';
    if (health >= 75) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Novo': return 'green';
      case 'Excelente': return 'blue';
      case 'Bom': return 'yellow';
      case 'Com Marcas': return 'yellow';
      case 'Quebrado': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <Badge variant="blue">Estoque Global</Badge>
          <h1 className="text-6xl font-black tracking-tighter text-white">
            Meus <span className="text-primary italic">Aparelhos</span>
          </h1>
          <p className="text-muted text-xl font-medium tracking-tight">Gerenciamento inteligente de estoque e controle de ROI individual.</p>
        </div>
        <Button className="px-10 h-16 text-lg" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={24} strokeWidth={3} />
          Cadastrar Aparelho
        </Button>
      </header>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Buscar por aparelho, marca ou modelo..." 
            className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-6 pl-16 pr-6 text-xl text-white outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all placeholder:text-muted/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="lg:col-span-5 flex bg-white/[0.02] border border-white/5 rounded-3xl p-2 gap-1 overflow-x-auto">
          {[
            { key: 'All', label: 'Todos' },
            { key: 'In Stock', label: 'Disponíveis' },
            { key: 'Reserved', label: 'Reservados' },
            { key: 'In Maintenance', label: 'Manutenção' },
            { key: 'Sold', label: 'Vendidos' }
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`flex-1 px-3 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap ${
                filter === opt.key ? 'bg-primary text-white shadow-2xl' : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      <AnimatePresence mode='popLayout'>
        {filteredBricks.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredBricks.map((brick) => {
              const profit = brick.salePrice 
                ? (brick.salePrice - brick.totalInvested - (brick.commission || 0) - (brick.saleFees || 0) - (brick.saleShipping || 0))
                : 0;
              const roi = brick.salePrice ? ((profit / brick.totalInvested) * 100).toFixed(1) : null;

              return (
                <motion.div variants={item} key={brick.id} layout>
                  <Card className="group p-0 overflow-hidden flex flex-col border-white/5 hover:border-primary/40 h-full">
                    {/* Image Header */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={brick.image} 
                        alt={brick.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                      
                      <div className="absolute top-5 left-5 flex gap-2">
                        <Badge variant={
                          brick.status === 'Sold' ? 'green' : 
                          brick.status === 'Reserved' ? 'yellow' : 
                          brick.status === 'In Maintenance' ? 'red' : 'gray'
                        }>
                          {brick.status === 'In Stock' ? 'Disponível' : brick.status === 'Reserved' ? 'Reservado' : brick.status === 'In Maintenance' ? 'Manutenção' : 'Vendido'}
                        </Badge>
                        <Badge variant={getConditionColor(brick.condition) as any}>
                          {brick.condition}
                        </Badge>
                      </div>
                      
                      <div className="absolute bottom-5 left-5 right-5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{brick.brand}</span>
                          <span className="text-[10px] text-muted">•</span>
                          <span className="text-[10px] font-bold text-muted">{brick.storage}</span>
                        </div>
                        <h4 className="text-xl font-black text-white leading-tight">{brick.model}</h4>
                        <div className="flex gap-4 mt-2">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-muted">
                            <Calendar size={12} className="text-primary" />
                            {new Date(brick.purchaseDate).toLocaleDateString('pt-BR')}
                          </div>
                          {brick.batteryHealth && (
                            <div className={`flex items-center gap-1 text-[10px] font-bold ${getBatteryColor(brick.batteryHealth)}`}>
                              <Battery size={12} />
                              {brick.batteryHealth}%
                            </div>
                          )}
                          {brick.color && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-muted">
                              <Tag size={12} className="text-primary" />
                              {brick.color}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Body */}
                    <div className="p-7 flex-1 flex flex-col">
                      {/* Defect notice */}
                      {brick.defect && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 mb-4 text-xs text-rose-400 font-bold">
                          <Wrench size={14} />
                          {brick.defect}
                        </div>
                      )}

                      {/* Accessories */}
                      {brick.accessories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {brick.accessories.map(acc => (
                            <span key={acc} className="text-[9px] font-bold text-muted bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">{acc}</span>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-muted uppercase tracking-widest opacity-60">Investimento</p>
                          <p className="text-lg font-black text-white leading-none">R$ {brick.totalInvested.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          {brick.status === 'Sold' ? (
                            <>
                              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Lucro Realizado</p>
                              <p className={`text-lg font-black leading-none ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>R$ {profit.toLocaleString()}</p>
                            </>
                          ) : (
                            <>
                              <p className="text-[9px] font-black text-muted uppercase tracking-widest opacity-60">Manutenção</p>
                              <p className="text-lg font-black text-amber-400 leading-none">R$ {brick.maintenanceCost.toLocaleString()}</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* ROI Progress Bar */}
                      {brick.status === 'Sold' && roi && (
                        <div className="mb-6 space-y-2">
                          <div className="flex justify-between items-center text-[9px] font-black text-muted uppercase tracking-widest">
                            <span>ROI</span>
                            <span className="text-primary">{roi}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(Number(roi), 100)}%` }}
                              transition={{ duration: 1.5, delay: 0.5 }}
                              className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full" 
                            />
                          </div>
                        </div>
                      )}

                      <div className="mt-auto flex gap-3">
                        {brick.status !== 'Sold' && (
                          <Button 
                            onClick={() => handleSell(brick)} 
                            className="flex-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
                          >
                            <CheckCircle size={18} strokeWidth={3} />
                            Vender
                          </Button>
                        )}
                        <Button 
                          variant="secondary" 
                          onClick={() => handleEdit(brick)} 
                          className="flex-1 aspect-square p-0 min-w-[50px]"
                        >
                          <Edit3 size={18} />
                        </Button>
                        <Button 
                          variant="secondary" 
                          onClick={() => handleDelete(brick.id)} 
                          className="aspect-square p-0 min-w-[50px] hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col items-center justify-center py-40 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem] text-center"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8 floating">
              <Smartphone size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-black text-white mb-2">Nada por aqui ainda</h3>
            <p className="text-muted max-w-sm text-lg font-medium">Seu estoque está vazio. Comece cadastrando seu primeiro aparelho!</p>
            <Button className="mt-10 px-12" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={24} strokeWidth={3} />
              Cadastrar Primeiro Aparelho
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AddBrickModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditBrickModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} brick={selectedBrick} />
      <SellBrickModal isOpen={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} brick={selectedBrick} />
    </div>
  );
};

export default Inventory;
