import React, { useState } from 'react';
import { Search, Plus, Filter, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui/Common';
import { mockBricks } from '../data/mockData';

const Inventory = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredBricks = mockBricks.filter(brick => {
    const matchesFilter = filter === 'All' || brick.status === filter;
    const matchesSearch = brick.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Meus Bricks</h2>
          <p className="text-muted">Gerencie seu estoque e acompanhe o ROI de cada investimento.</p>
        </div>
        <Button className="w-fit">
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
        <div className="flex bg-card border border-slate-800 rounded-xl p-1 shrink-0">
          {['All', 'In Stock', 'Reserved', 'Sold'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === opt ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-white'
              }`}
            >
              {opt === 'All' ? 'Todos' : opt === 'In Stock' ? 'Em Estoque' : opt === 'Reserved' ? 'Reservados' : 'Vendidos'}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBricks.map((brick) => {
          const profit = brick.salePrice ? brick.salePrice - brick.purchasePrice - brick.fees - brick.shipping : 0;
          const roi = ((profit / brick.purchasePrice) * 100).toFixed(1);

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
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{brick.category}</p>
                  <h4 className="text-xl font-bold text-white line-clamp-1">{brick.name}</h4>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted flex items-center gap-1.5"><Calendar size={14} /> Comprado em</span>
                    <span className="text-slate-200">{new Date(brick.purchaseDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted flex items-center gap-1.5"><DollarSign size={14} /> Investido</span>
                    <span className="text-slate-200 font-semibold">R$ {brick.purchasePrice.toLocaleString()}</span>
                  </div>
                  {brick.status === 'Sold' && (
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
                  )}
                </div>

                <div className="mt-auto border-t border-slate-800 pt-4 flex gap-2">
                  <Button variant="secondary" className="flex-1 text-sm py-2">Detalhes</Button>
                  <Button className="flex-1 text-sm py-2">Editar</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Inventory;
