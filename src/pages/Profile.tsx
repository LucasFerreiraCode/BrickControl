import React from 'react';
import { User as UserIcon, Mail, Phone, Calendar, Shield, CreditCard, ShoppingBag, TrendingUp, Edit3, Settings, Bell, Lock } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';
import { motion } from 'framer-motion';

const Profile = () => {
  const { stats } = useBricks();

  return (
    <div className="space-y-12 py-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <Badge variant="blue">Central do Usuário</Badge>
          <h1 className="text-6xl font-black tracking-tighter text-white">
            Meu <span className="text-primary italic">Profile</span>
          </h1>
          <p className="text-muted text-xl font-medium tracking-tight">Gerencie sua identidade digital e preferências de segurança.</p>
        </div>
        <Button variant="secondary" className="px-8 h-16 border-white/10 text-lg">
          <Settings size={20} className="mr-2" />
          Settings
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Card */}
        <Card className="lg:col-span-4 p-10 bg-slate-900/30 text-center relative overflow-hidden group">
          <div className="relative z-10">
            <div className="relative w-40 h-40 mx-auto mb-8">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400" 
                className="w-full h-full rounded-full border-4 border-white/5 shadow-2xl relative z-10 object-cover grayscale hover:grayscale-0 transition-all duration-700"
                alt="Avatar"
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-[#0a0f19] z-20" 
              />
            </div>
            
            <h3 className="text-3xl font-black text-white tracking-tighter mb-1">Lucas Ferreira</h3>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-10">Revendedor Premium</p>
            
            <div className="space-y-6 text-left bg-white/[0.02] p-6 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-widest">E-mail</p>
                  <p className="text-sm font-bold text-white">lucas@brickcontrol.io</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-widest">Phone</p>
                  <p className="text-sm font-bold text-white">+55 11 99999-0000</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-widest">Membro desde</p>
                  <p className="text-sm font-bold text-white">07 de Julho, 2026</p>
                </div>
              </div>
            </div>

            <Button variant="secondary" className="w-full mt-8 h-14 font-black uppercase tracking-widest border-white/5 hover:bg-primary hover:text-white transition-all">
              <Edit3 size={18} className="mr-2" />
              Editar Perfil
            </Button>
          </div>
          
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
        </Card>

        {/* Performance & Security Panel */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShoppingBag, label: 'Execuções', value: stats.soldProducts, color: 'text-primary', bg: 'bg-primary/10' },
              { icon: TrendingUp, label: 'Lucro Líquido', value: `R$ ${stats.accumulatedProfit.toLocaleString()}`, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { icon: CreditCard, label: 'Total Equity', value: `R$ ${stats.currentCapital.toLocaleString()}`, color: 'text-amber-400', bg: 'bg-amber-400/10' },
            ].map((stat, i) => (
              <Card key={i} className="p-8 text-center group hover:bg-white/[0.02] transition-all">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={22} strokeWidth={2.5} />
                </div>
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <h4 className="text-2xl font-black text-white tracking-tighter leading-none">{stat.value}</h4>
              </Card>
            ))}
          </div>

          <Card className="p-10 bg-slate-900/40">
            <h3 className="text-2xl font-black text-white tracking-tighter mb-10">Assinatura & Segurança</h3>
            
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] group relative overflow-hidden">
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/40 rotate-3">
                    <Shield size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white tracking-tight">Membro Premium <span className="text-primary italic">Diamond</span></h4>
                    <p className="text-sm font-bold text-primary/60">Válido até Julho de 2027</p>
                  </div>
                </div>
                <Badge variant="blue" className="px-8 py-3 text-sm mt-4 md:mt-0 relative z-10">Ativo</Badge>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                    <Lock size={14} className="text-primary" /> Segurança da Conta
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Autenticação 2FA', active: true },
                      { label: 'Alertas de Login', active: true },
                    ].map((config, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer">
                        <span className="text-sm font-bold text-slate-300">{config.label}</span>
                        <div className={`w-12 h-6 rounded-full relative transition-colors ${config.active ? 'bg-primary' : 'bg-slate-700'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.active ? 'right-1' : 'left-1'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                    <Bell size={14} className="text-primary" /> Notificações
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Relatórios Semanais', active: false },
                      { label: 'Metas Atingidas', active: true },
                    ].map((config, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer">
                        <span className="text-sm font-bold text-slate-300">{config.label}</span>
                        <div className={`w-12 h-6 rounded-full relative transition-colors ${config.active ? 'bg-primary' : 'bg-slate-700'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.active ? 'right-1' : 'left-1'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
