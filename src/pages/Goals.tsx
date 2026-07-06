import React, { useState } from 'react';
import { Target, TrendingUp, DollarSign, Wallet, Plus, ChevronRight, Trash2 } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';
import { AddGoalModal } from '../components/modals/AddGoalModal';

const Goals = () => {
  const { goals, deleteGoal, stats } = useBricks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Metas</h2>
          <p className="text-muted">Desafie-se e acompanhe sua evolução rumo à liberdade financeira.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Nova Meta
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {goals.length > 0 ? goals.map((goal) => {
          // Dynamic progress based on type
          let currentVal = goal.current;
          if (goal.type === 'Profit') currentVal = stats.accumulatedProfit;
          if (goal.type === 'Revenue') currentVal = stats.totalIn;
          if (goal.type === 'Capital') currentVal = stats.currentCapital;

          const percentage = Math.min((currentVal / goal.target) * 100, 100);
          const deficit = goal.target - currentVal;
          
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
                    <span className="text-sm font-medium text-muted">Progresso (R$ {currentVal.toLocaleString()})</span>
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
                  <h5 className="text-lg font-bold text-white">{deficit > 0 ? `R$ ${deficit.toLocaleString()}` : 'Concluído!'}</h5>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => { if(window.confirm('Excluir meta?')) deleteGoal(goal.id) }} 
                    className="p-2 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 opacity-5 blur-[80px] -translate-y-1/2 translate-x-1/4 rounded-full ${
                goal.type === 'Profit' ? 'bg-success' :
                goal.type === 'Revenue' ? 'bg-primary' : 'bg-amber-500'
              }`} />
            </Card>
          );
        }) : (
          <div className="py-20 text-center bg-card border border-dashed border-slate-800 rounded-2xl">
            <Target size={48} className="mx-auto text-muted mb-4" />
            <h3 className="text-white font-bold">Nenhuma meta definida</h3>
            <p className="text-muted text-sm mt-2">Defina seus objetivos financeiros para acompanhar seu progresso.</p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-6">Criar minha primeira meta</Button>
          </div>
        )}
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
            <p className="text-sm text-slate-400 max-w-md">Ao atingir R$ 15.000 de lucro total, você alcançará o nível Ouro. Faltam apenas R$ {(15000 - stats.accumulatedProfit > 0 ? 15000 - stats.accumulatedProfit : 0).toLocaleString()}!</p>
          </div>
          <Button variant="secondary" className="ml-auto border-indigo-500/30">
            Ver Conquistas
          </Button>
        </div>
      </Card>

      <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Goals;
