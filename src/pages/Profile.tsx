import React from 'react';
import { User as UserIcon, Mail, Phone, Calendar, Shield, CreditCard, ShoppingBag, TrendingUp } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui/Common';
import { useBricks } from '../context/BrickContext';

const Profile = () => {
  const { stats } = useBricks();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Perfil do Revendedor</h2>
        <p className="text-muted">Gerencie sua conta e visualize suas conquistas históricas.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <Card className="lg:col-span-1 text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" 
              className="w-full h-full rounded-full border-4 border-primary shadow-xl shadow-primary/20 object-cover"
              alt="Avatar"
            />
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-success rounded-full border-4 border-card flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Lucas Ferreira</h3>
          <p className="text-muted text-sm mb-6">Revendedor Premium @ BrickTracker</p>
          
          <div className="space-y-4 text-left border-t border-slate-800 pt-6">
            <div className="flex items-center gap-3 text-sm">
              <Mail size={16} className="text-primary" />
              <span className="text-slate-300">lucas@bricktracker.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-primary" />
              <span className="text-slate-300">(11) 99999-9999</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} className="text-primary" />
              <span className="text-slate-300">Membro desde Maio/2026</span>
            </div>
          </div>

          <Button variant="secondary" className="w-full mt-8">Editar Perfil</Button>
        </Card>

        {/* Career Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center group hover:bg-primary/5 transition-colors">
              <ShoppingBag size={24} className="mx-auto text-primary mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm text-muted mb-1">Vendas Totais</p>
              <h4 className="text-2xl font-bold text-white">{stats.soldProducts}</h4>
            </Card>
            <Card className="text-center group hover:bg-success/5 transition-colors">
              <TrendingUp size={24} className="mx-auto text-success mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm text-muted mb-1">Lucro Histórico</p>
              <h4 className="text-2xl font-bold text-white">R$ {stats.accumulatedProfit.toLocaleString()}</h4>
            </Card>
            <Card className="text-center group hover:bg-amber-500/5 transition-colors">
              <CreditCard size={24} className="mx-auto text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm text-muted mb-1">Capital Acumulado</p>
              <h4 className="text-2xl font-bold text-white">R$ {stats.currentCapital.toLocaleString()}</h4>
            </Card>
          </div>

          <Card>
            <h3 className="text-xl font-bold text-white mb-6">Assinatura e Segurança</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/20 text-primary">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Plano PRO Ativo</h4>
                    <p className="text-xs text-muted">Vence em 15/07/2026</p>
                  </div>
                </div>
                <Badge variant="blue">Premium Access</Badge>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted uppercase">Configurações Rápidas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border border-slate-800 rounded-lg">
                    <span className="text-sm text-slate-300">Autenticação em 2 etapas</span>
                    <div className="w-10 h-5 bg-primary rounded-full relative">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-800 rounded-lg">
                    <span className="text-sm text-slate-300">Notificações por Email</span>
                    <div className="w-10 h-5 bg-slate-700 rounded-full relative">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                    </div>
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
