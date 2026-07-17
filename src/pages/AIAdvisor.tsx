import { useState, useRef, useEffect } from 'react';
import { Card, Badge, Button } from '../components/ui/Common';
import { motion } from 'framer-motion';
import { useBricks } from '../context/BrickContext';
import { Brain, Send, Sparkles, User, Zap, ShoppingCart, TrendingUp, HelpCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAdvisor = () => {
  const { bricks, stats } = useBricks();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente inteligente do ElectroControl. Posso te ajudar com análises de compras, sugestões de preços, avaliar trocas e identificar oportunidades de lucro. Como posso ajudar?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase();
    const sold = bricks.filter(b => b.status === 'Sold');
    const stock = bricks.filter(b => b.status === 'In Stock');

    // Modelo mais lucrativo
    if (q.includes('mais lucrativo') || q.includes('melhor modelo') || q.includes('mais lucro')) {
      if (sold.length === 0) return 'Você ainda não tem vendas registradas. Cadastre suas vendas para que eu possa analisar qual modelo é mais lucrativo.';
      const profitByModel: Record<string, { profit: number; count: number }> = {};
      sold.forEach(b => {
        const p = (b.salePrice || 0) - b.totalInvested - (b.commission || 0) - (b.saleFees || 0) - (b.saleShipping || 0);
        if (!profitByModel[b.model]) profitByModel[b.model] = { profit: 0, count: 0 };
        profitByModel[b.model].profit += p;
        profitByModel[b.model].count += 1;
      });
      const best = Object.entries(profitByModel).sort((a, b) => b[1].profit - a[1].profit)[0];
      return `📊 O modelo mais lucrativo foi o **${best[0]}**, que gerou R$ ${best[1].profit.toLocaleString()} de lucro em ${best[1].count} venda(s). ROI médio de ${((best[1].profit / sold.filter(b => b.model === best[0]).reduce((a, b) => a + b.totalInvested, 0)) * 100).toFixed(0)}%.`;
    }

    // Quanto posso vender / vale a pena
    if (q.includes('vale a pena') || q.includes('comprar') || q.includes('quanto posso vender')) {
      return `💡 Para avaliar se vale a pena, considere: o ROI médio das suas vendas é de **${stats.averageROI}%**. Um bom negócio deveria ter margem acima de 15%. Use o Simulador para calcular o lucro antes de fechar qualquer compra!`;
    }

    // Venda mais rápida
    if (q.includes('vende mais rápido') || q.includes('mais rápido') || q.includes('gira mais')) {
      if (sold.length === 0) return 'Sem dados de vendas ainda para analisar velocidade de giro.';
      const timeByModel: Record<string, number[]> = {};
      sold.forEach(b => {
        if (b.saleDate && b.purchaseDate) {
          const days = Math.ceil((new Date(b.saleDate).getTime() - new Date(b.purchaseDate).getTime()) / (1000 * 60 * 60 * 24));
          if (!timeByModel[b.model]) timeByModel[b.model] = [];
          timeByModel[b.model].push(days);
        }
      });
      const fastest = Object.entries(timeByModel)
        .map(([model, days]) => ({ model, avg: days.reduce((a, b) => a + b, 0) / days.length }))
        .sort((a, b) => a.avg - b.avg)[0];
      if (fastest) return `⚡ O modelo que vende mais rápido é o **${fastest.model}**, com tempo médio de **${Math.round(fastest.avg)} dias** em estoque.`;
      return 'Não consegui calcular o giro. Verifique se as datas de compra e venda estão preenchidas.';
    }

    // Estoque
    if (q.includes('estoque') || q.includes('disponível') || q.includes('tenho')) {
      return `📦 Você tem **${stock.length} aparelho(s)** em estoque, com capital investido de **R$ ${stats.workingCapital.toLocaleString()}**. ${stats.maintenanceProducts > 0 ? `⚠️ ${stats.maintenanceProducts} aparelho(s) em manutenção.` : ''}`;
    }

    // Manutenção
    if (q.includes('manutenção') || q.includes('conserto') || q.includes('reparo')) {
      const totalMaint = bricks.reduce((a, b) => a + b.maintenanceCost, 0);
      return `🔧 Seu gasto total com manutenção é de **R$ ${totalMaint.toLocaleString()}**. ${totalMaint > 1000 ? 'Considere priorizar aparelhos que não precisem de reparos para melhorar suas margens.' : 'Seus custos com manutenção estão dentro do esperado.'}`;
    }

    // Lucro / resultados
    if (q.includes('lucro') || q.includes('resultado') || q.includes('ganhei')) {
      return `💰 Seu lucro acumulado é de **R$ ${stats.accumulatedProfit.toLocaleString()}** com faturamento total de **R$ ${stats.totalRevenue.toLocaleString()}**. Você vendeu **${stats.soldProducts} aparelho(s)** com ticket médio de **R$ ${stats.ticketMedio.toLocaleString()}** e ROI médio de **${stats.averageROI}%**.`;
    }

    // Troca
    if (q.includes('troca') || q.includes('trocar')) {
      return `🔄 Para avaliar se uma troca compensa, calcule o valor de mercado do aparelho que você receberia e compare com o que está entregando. Use o Simulador para rodar os números. Lembre-se: o ROI médio do seu histórico é ${stats.averageROI}%.`;
    }

    // Default
    return `🤖 Entendi sua pergunta! Com base nos seus dados: você tem ${stats.stockProducts} aparelho(s) em estoque, ${stats.soldProducts} vendido(s), lucro acumulado de R$ ${stats.accumulatedProfit.toLocaleString()} e ROI médio de ${stats.averageROI}%. Pode me perguntar sobre modelos mais lucrativos, velocidade de venda, análise de compra ou qualquer outra coisa!`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    const response = generateResponse(input);
    const aiMsg: Message = { role: 'assistant', content: response };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  const quickPrompts = [
    { icon: TrendingUp, text: 'Qual modelo é mais lucrativo?' },
    { icon: Zap, text: 'Qual aparelho vende mais rápido?' },
    { icon: ShoppingCart, text: 'Vale a pena comprar um iPhone 13 por R$ 2.300?' },
    { icon: HelpCircle, text: 'Como está meu lucro?' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <header className="pb-6 border-b border-white/5">
        <Badge variant="blue">Inteligência Artificial</Badge>
        <h1 className="text-6xl font-black tracking-tighter text-white mt-2">
          Consultor <span className="text-primary italic">IA</span>
        </h1>
        <p className="text-muted text-xl font-medium tracking-tight mt-2">Seu assistente inteligente para análise de negociações e estratégias.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chat Area */}
        <Card className="lg:col-span-8 p-0 bg-slate-900/40 flex flex-col overflow-hidden" style={{ minHeight: '70vh' }}>
          {/* Messages */}
          <div className="flex-1 p-8 space-y-6 overflow-y-auto">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <Brain size={18} />
                  </div>
                )}
                <div className={`max-w-[75%] px-5 py-4 rounded-2xl text-sm font-medium leading-relaxed ${
                  msg.role === 'assistant' 
                    ? 'bg-white/[0.03] border border-white/5 text-slate-300' 
                    : 'bg-primary/20 border border-primary/20 text-white'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-muted shrink-0">
                    <User size={18} />
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-white/5 bg-background/40">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Pergunte sobre compras, margens, modelos..."
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend} className="px-6 py-4">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Prompts Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={18} className="text-primary" />
              <h3 className="text-lg font-black text-white">Perguntas Rápidas</h3>
            </div>
            <div className="space-y-3">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(prompt.text);
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left hover:bg-white/[0.05] hover:border-primary/20 transition-all group"
                >
                  <prompt.icon size={16} className="text-primary shrink-0" />
                  <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">{prompt.text}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-8 bg-slate-900/40">
            <h4 className="text-sm font-black text-white mb-4">📊 Seus Números</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted font-bold">Aparelhos em estoque</span>
                <span className="text-white font-black">{stats.stockProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted font-bold">Total vendidos</span>
                <span className="text-emerald-400 font-black">{stats.soldProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted font-bold">Lucro acumulado</span>
                <span className="text-emerald-400 font-black">R$ {stats.accumulatedProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted font-bold">ROI médio</span>
                <span className="text-primary font-black">{stats.averageROI}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted font-bold">Ticket médio</span>
                <span className="text-white font-black">R$ {stats.ticketMedio.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAdvisor;
