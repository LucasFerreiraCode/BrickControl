import React, { useState } from 'react';
import { Target, TrendingUp, DollarSign, Wallet, Plus, ChevronRight, Trash2, Trophy, Star } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';
import { AddGoalModal } from '../components/modals/AddGoalModal';
import { motion, AnimatePresence } from 'framer-motion';

const Goals = () => {
  const { goals, deleteGoal, stats } = useBricks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-16 py-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <Badge variant="yellow">Expansão Patrimonial</Badge>
          <h1 className="text-6xl font-black tracking-tighter text-white">
            Metas de <span className="text-primary italic">Alta Performance</span>
          </h1>
          <p className="text-muted text-xl font-medium tracking-tight">Defina seus marcos e visualize sua jornada rumo à liberdade financeira.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="px-10 h-16 text-lg">
          <Plus size={24} strokeWidth={3} />
          Definir Nova Meta
        </Button>
      </header>

      {/* Rewards / Milestones Display */}
      <Card className="p-12 bg-gradient-to-br from-primary/20 via-background to-background border-primary/20 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="relative">
            <div className="w-32 h-32 bg-amber-400/10 rounded-[2.5rem] flex items-center justify-center border border-amber-400/20 shadow-2xl shadow-amber-400/20 rotate-6 group-hover:rotate-12 transition-transform duration-700">
              <Trophy size={60} className="text-amber-400" strokeWidth={1.5} />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white"
            >
              <Star size={16} fill="currentColor" />
            </motion.div>
          </div>
          <div className="space-y-3 text-center lg:text-left flex-1">
            <Badge variant="blue">Próximo Achievement</Badge>
            <h3 className="text-4xl font-black text-white tracking-tighter">Revendedor Nível <span className="text-amber-400 italic">Ouro</span></h3>
            <p className="text-lg font-medium text-slate-400 max-w-2xl">
              Alcance <span className="text-white font-black">R$ 15.000</span> de lucro líquido acumulado para desbloquear análises de mercado avançadas.
            </p>
            <div className="pt-4 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-800 flex items-center justify-center text-[10px] font-black">{i}k</div>
                ))}
              </div>
              <p className="text-xs font-black text-muted uppercase tracking-widest">
                Faltam apenas <span className="text-primary">R$ {(15000 - stats.accumulatedProfit > 0 ? 15000 - stats.accumulatedProfit : 0).toLocaleString()}</span>
              </p>
            </div>
          </div>
          <Button variant="secondary" className="px-10 h-16 border-white/10 group-hover:bg-primary group-hover:text-white transition-all">
            Ver Roadmap
          </Button>
        </div>
        
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full opacity-50" />
      </Card>

      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode='popLayout'>
          {goals.length > 0 ? goals.map((goal) => {
            let currentVal = goal.current;
            if (goal.type === 'Profit') currentVal = stats.accumulatedProfit;
            if (goal.type === 'Revenue') currentVal = stats.totalIn;
            if (goal.type === 'Capital') currentVal = stats.currentCapital;

            const percentage = Math.min((currentVal / goal.target) * 100, 100);
            const deficit = goal.target - currentVal;
            
            return (
              <motion.div 
                layout
                key={goal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="p-10 relative overflow-hidden group hover:border-primary/40 bg-slate-900/30">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
                    <div className="flex items-center gap-8">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-6 ${
                        goal.type === 'Profit' ? 'bg-emerald-500/10 text-emerald-400' :
                        goal.type === 'Revenue' ? 'bg-primary/10 text-primary' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {goal.type === 'Profit' ? <TrendingUp size={36} strokeWidth={2.5} /> :
                        goal.type === 'Revenue' ? <DollarSign size={40} strokeWidth={2.5} /> :
                        <Wallet size={36} strokeWidth={2.5} />}
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-white tracking-tighter mb-2">{goal.title}</h4>
                        <div className="flex gap-4">
                          <Badge variant={goal.type === 'Profit' ? 'green' : goal.type === 'Revenue' ? 'blue' : 'yellow'}>
                            {goal.type === 'Profit' ? 'Lucro' : goal.type === 'Revenue' ? 'Faturamento' : 'Patrimônio'}
                          </Badge>
                          <p className="text-sm font-black text-muted uppercase tracking-widest mt-1">
                            Target: <span className="text-white">R$ {goal.target.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 max-w-2xl w-full">
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Progresso Atual: R$ {currentVal.toLocaleString()}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-white tracking-tighter">{percentage.toFixed(0)}</span>
                          <span className="text-xl font-black text-primary">%</span>
                        </div>
                      </div>
                      <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 2, ease: "circOut" }}
                          className={`h-full rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3)] ${
                            percentage === 100 ? 'bg-emerald-400' : 
                            goal.type === 'Profit' ? 'bg-emerald-400' :
                            goal.type === 'Revenue' ? 'bg-primary' : 'bg-amber-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-6">
                      <div className="hidden xl:block text-right">
                        <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1 opacity-50 text-right">Gap Pendente</p>
                        <h5 className="text-2xl font-black text-white tracking-tighter">
                          {deficit > 0 ? `R$ ${deficit.toLocaleString()}` : 'META ATINGIDA'}
                        </h5>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => { if(window.confirm('Deseja realmente arquivar esta meta?')) deleteGoal(goal.id) }} 
                          className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                        >
                          <Trash2 size={24} />
                        </button>
                        <button className="w-14 h-14 bg-white/5 text-muted rounded-2xl flex items-center justify-center hover:text-white hover:bg-white/10 transition-all">
                          <ChevronRight size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Background Glow */}
                  <div className={`absolute top-0 right-0 w-[400px] h-[400px] opacity-10 blur-[100px] -translate-y-1/2 translate-x-1/4 rounded-full pointer-events-none ${
                    goal.type === 'Profit' ? 'bg-emerald-500' :
                    goal.type === 'Revenue' ? 'bg-primary' : 'bg-amber-500'
                  }`} />
                </Card>
              </motion.div>
            );
          }) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="py-40 text-center bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem]"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary mx-auto mb-8 floating">
                <Target size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-4xl font-black text-white mb-4 tracking-tighter">Visão Estratégica Vazia</h3>
              <p className="text-muted text-xl font-medium max-w-sm mx-auto mb-10">Defina seus objetivos de crescimento para desbloquear o poder total da plataforma.</p>
              <Button onClick={() => setIsModalOpen(true)} className="px-12 h-16 text-lg">
                <Plus size={24} strokeWidth={3} />
                Arquitete sua Primeira Meta
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Goals;
