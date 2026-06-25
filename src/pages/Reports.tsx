import React from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Award, 
  Clock,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, Badge } from '../components/ui/Common';

const pieData = [
  { name: 'iPhone', value: 45 },
  { name: 'Consoles', value: 25 },
  { name: 'Laptops', value: 20 },
  { name: 'Outros', value: 10 },
];

const COLORS = ['#2563EB', '#22C55E', '#F59E0B', '#94A3B8'];

const Reports = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Relatórios</h2>
          <p className="text-muted">Análise profunda do desempenho do seu negócio.</p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          Mensal (Junho)
          <ChevronDown size={16} />
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Melhor Venda', value: 'iPhone 13', sub: 'R$ 600 lucro', icon: Award, color: 'text-amber-500' },
          { title: 'Maior ROI', value: '47%', sub: 'Nintendo Switch', icon: TrendingUp, color: 'text-success' },
          { title: 'Tempo Médio', value: '4.2 dias', sub: 'Para vender', icon: Clock, color: 'text-primary' },
          { title: 'Volume', value: '18 bricks', sub: 'Este mês', icon: BarChart3, color: 'text-purple-500' },
        ].map((item, i) => (
          <Card key={i} className="border-slate-800">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm text-muted font-medium">{item.title}</p>
              <item.icon size={18} className={item.color} />
            </div>
            <h4 className="text-xl font-bold text-white">{item.value}</h4>
            <p className="text-xs text-muted mt-1">{item.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">ROI por Categoria</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { cat: 'Smartphones', roi: 38 },
                { cat: 'Games', roi: 42 },
                { cat: 'Hardware', roi: 25 },
                { cat: 'Acessórios', roi: 55 },
              ]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="cat" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="roi" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Distribuição de Faturamento</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-muted">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const Button = ({ children, variant = 'primary', className, ...props }: any) => {
  const variants: any = {
    primary: "bg-primary text-white",
    secondary: "bg-white/5 text-muted border border-white/10"
  };
  return <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

export default Reports;
