import React from 'react';
import { Target, TrendingUp, DollarSign, Wallet, Plus, ChevronRight } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui/Common';
import { goals } from '../data/mockData';

const Goals = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Metas</h2>
          <p className="text-muted">Desafie-se e acompanhe sua evolução rumo à liberdade financeira.</p>
        </div>
        <Button>
          <Plus size={20} />
          Nova Meta
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {goals.map((goal) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100);
          const deficit = goal.target - goal.current;
          
          return (
            <Card key={goal.id} className="relative overflow-hidden group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${
                    goal.type === 'Profit' ? 'bg-success/10 text-success' :
                    goal.type === 'Revenue' ? 'bg-primary/10 text-primary' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {goal.type === 'Profit' ? <TrendingUp size={24} /> :
                     goal.type === 'Revenue' ? <DollarSign size={24} /> :
                     <Wallet size={24} />}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{goal.title}</h4>
                    <p className="text-sm text-muted">
                      Objetivo: <span className="text-white font-semibold">R$ {goal.target.toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                <div className="flex-1 max-w-md w-full">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-muted">Progresso</span>
                    <span className="text-lg font-bold text-white">{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out rounded-full ${
                        percentage === 100 ? 'bg-success' : 
                        goal.type === 'Profit' ? 'bg-success' :
                        goal.type === 'Revenue' ? 'bg-primary' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="text-right hidden md:block">
                  <p className="text-sm text-muted mb-1">Restante</p>
                  <h5 className="text-lg font-bold text-white">R$ {deficit > 0 ? deficit.toLocaleString() : 'Concluído!'}</h5>
                </div>

                <button className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
              
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 opacity-5 blur-[80px] -translate-y-1/2 translate-x-1/4 rounded-full ${
                goal.type === 'Profit' ? 'bg-success' :
                goal.type === 'Revenue' ? 'bg-primary' : 'bg-amber-500'
              }`} />
            </Card>
          );
        })}
      </div>

      {/* Rewards / Milestones */}
      <Card className="bg-gradient-to-br from-slate-900 to-indigo-950 border-indigo-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Próximo Marco</h3>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 shadow-2xl shadow-amber-500/20">
            <span className="text-3xl">🏆</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Revendedor Ouro</h4>
            <p className="text-sm text-slate-400 max-w-md">Ao atingir R$ 15.000 de lucro total, você alcançará o nível Ouro. Faltam apenas R$ 2.500!</p>
          </div>
          <Button variant="secondary" className="ml-auto border-indigo-500/30">
            Ver Conquistas
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Goals;
