import React, { useState } from 'react';
import { Search, Plus, Filter, Calendar, TrendingUp, DollarSign, Package, Trash2, Edit3, CheckCircle } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';
import { AddBrickModal } from '../components/modals/AddBrickModal';
import { EditBrickModal } from '../components/modals/EditBrickModal';
import { SellBrickModal } from '../components/modals/SellBrickModal';
import { Brick } from '../data/mockData';

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
    const matchesSearch = brick.name.toLowerCase().includes(search.toLowerCase());
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
    if (window.confirm('Tem certeza que deseja excluir este brick?')) {
      deleteBrick(id);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Meus Bricks</h2>
          <p className="text-muted">Gerencie seu estoque e acompanhe o ROI de cada investimento.</p>
        </div>
        <Button className="w-fit" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} />
          Novo Brick
        </Button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar produto..." 
            className="w-full bg-card border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-card border border-slate-800 rounded-xl p-1 shrink-0 overflow-x-auto">
          {['All', 'In Stock', 'Reserved', 'Sold'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === opt ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-white'
              }`}
            >
              {opt === 'All' ? 'Todos' : opt === 'In Stock' ? 'Em Estoque' : opt === 'Reserved' ? 'Reservados' : 'Vendidos'}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      {filteredBricks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBricks.map((brick) => {
            const totalCost = brick.purchasePrice + brick.fees + brick.shipping;
            const profit = brick.salePrice ? brick.salePrice - totalCost : 0;
            const roi = ((profit / totalCost) * 100).toFixed(1);

            return (
              <Card key={brick.id} className="group p-0 overflow-hidden flex flex-col border-slate-800 hover:border-primary/30 card-hover">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={brick.image} 
                    alt={brick.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant={brick.status === 'Sold' ? 'green' : brick.status === 'Reserved' ? 'yellow' : 'gray'}>
                      {brick.status === 'In Stock' ? 'Em Estoque' : brick.status === 'Reserved' ? 'Reservado' : 'Vendido'}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDelete(brick.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg backdrop-blur-md transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{brick.category}</p>
                      <button onClick={() => handleEdit(brick)} className="text-muted hover:text-primary transition-colors">
                        <Edit3 size={16} />
                      </button>
                    </div>
                    <h4 className="text-xl font-bold text-white line-clamp-1">{brick.name}</h4>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted flex items-center gap-1.5"><Calendar size={14} /> Comprado em</span>
                      <span className="text-slate-200">{new Date(brick.purchaseDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted flex items-center gap-1.5"><DollarSign size={14} /> Investido</span>
                      <span className="text-slate-200 font-semibold">R$ {totalCost.toLocaleString()}</span>
                    </div>
                    {brick.status === 'Sold' ? (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted flex items-center gap-1.5"><TrendingUp size={14} /> Lucro</span>
                          <span className="text-success font-bold">R$ {profit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted">ROI</span>
                          <Badge variant="blue">{roi}%</Badge>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted flex items-center gap-1.5"><TrendingUp size={14} /> Lucro Estimado (30%)</span>
                        <span className="text-slate-400">R$ {(totalCost * 0.3).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto border-t border-slate-800 pt-4 flex gap-2">
                    {brick.status !== 'Sold' && (
                      <Button onClick={() => handleSell(brick)} className="flex-1 text-sm py-2 bg-success hover:bg-success/90">
                        <CheckCircle size={16} />
                        Vender
                      </Button>
                    )}
                    <Button variant="secondary" onClick={() => handleEdit(brick)} className="flex-1 text-sm py-2">Editar</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed border-slate-800 rounded-3xl text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-muted mb-4">
            <Package size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhum Brick encontrado</h3>
          <p className="text-muted max-w-xs">Você ainda não possui produtos cadastrados. Comece adicionando seu primeiro investimento!</p>
          <Button className="mt-6" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={20} />
            Novo Brick
          </Button>
        </div>
      )}

      <AddBrickModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditBrickModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} brick={selectedBrick} />
      <SellBrickModal isOpen={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} brick={selectedBrick} />
    </div>
  );
};

export default Inventory;
