import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Brick, type Transaction, type Goal, mockBricks, goals as initialGoals, transactions as initialTransactions } from '../data/mockData';

interface BrickContextType {
  bricks: Brick[];
  transactions: Transaction[];
  goals: Goal[];
  addBrick: (brick: Omit<Brick, 'id'>) => void;
  updateBrick: (id: string, brick: Partial<Brick>) => void;
  sellBrick: (
    id: string, 
    salePrice: number, 
    saleDate: string, 
    paymentMethod: Brick['paymentMethod'], 
    commission?: number, 
    saleFees?: number, 
    saleShipping?: number, 
    client?: string, 
    observations?: string
  ) => void;
  deleteBrick: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  deleteGoal: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  stats: any;
}

const BrickContext = createContext<BrickContextType | undefined>(undefined);

export const BrickProvider = ({ children }: { children: React.ReactNode }) => {
  const [bricks, setBricks] = useState<Brick[]>(() => {
    try {
      const saved = localStorage.getItem('bt_bricks');
      return saved ? JSON.parse(saved) : mockBricks;
    } catch (e) {
      console.error('Error loading bricks:', e);
      return mockBricks;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('bt_transactions');
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch (e) {
      console.error('Error loading transactions:', e);
      return initialTransactions;
    }
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem('bt_goals');
      return saved ? JSON.parse(saved) : initialGoals;
    } catch (e) {
      console.error('Error loading goals:', e);
      return initialGoals;
    }
  });

  useEffect(() => {
    localStorage.setItem('bt_bricks', JSON.stringify(bricks));
    localStorage.setItem('bt_transactions', JSON.stringify(transactions));
    localStorage.setItem('bt_goals', JSON.stringify(goals));
  }, [bricks, transactions, goals]);

  const addBrick = (newBrick: Omit<Brick, 'id'>) => {
    const brickWithId = { ...newBrick, id: 'ele-' + Math.random().toString(36).substr(2, 5) };
    setBricks(prev => [...prev, brickWithId]);
  };

  const updateBrick = (id: string, updatedData: Partial<Brick>) => {
    setBricks(prev => prev.map(b => b.id === id ? { ...b, ...updatedData } : b));
  };

  const sellBrick = (
    id: string, 
    salePrice: number, 
    saleDate: string, 
    paymentMethod: Brick['paymentMethod'], 
    commission = 0, 
    saleFees = 0, 
    saleShipping = 0, 
    client = '', 
    observations = ''
  ) => {
    const brickToSell = bricks.find(b => b.id === id);
    if (!brickToSell) return;

    // Registrar receita bruta da venda
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: saleDate,
      type: 'In',
      description: `Venda: ${brickToSell.name}`,
      value: salePrice
    };

    // Registrar saída caso haja tarifas/comissão ou custo de envio na venda
    const totalSaleCosts = commission + saleFees + saleShipping;
    const itemsToSet = [newTransaction];
    if (totalSaleCosts > 0) {
      itemsToSet.push({
        id: Math.random().toString(36).substr(2, 9),
        date: saleDate,
        type: 'Out',
        description: `Taxas/Custos da Venda: ${brickToSell.name}`,
        value: totalSaleCosts
      });
    }

    setTransactions(t => [...itemsToSet, ...t]);
    setBricks(prev => prev.map(b => b.id === id ? { 
      ...b, 
      salePrice, 
      saleDate, 
      paymentMethod,
      commission,
      saleFees,
      saleShipping,
      client,
      observations,
      status: 'Sold' as const 
    } : b));
  };

  const deleteBrick = (id: string) => {
    setBricks(prev => prev.filter(b => b.id !== id));
  };

  const addGoal = (newGoal: Omit<Goal, 'id'>) => {
    const goalWithId = { ...newGoal, id: Math.random().toString(36).substr(2, 9) };
    setGoals(prev => [...prev, goalWithId]);
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addTransaction = (newT: Omit<Transaction, 'id'>) => {
    const tWithId = { ...newT, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [tWithId, ...prev]);
  };

  // Estatísticas Dinâmicas Customizadas para Eletrônicos
  const stats = React.useMemo(() => {
    const sold = bricks.filter(b => b.status === 'Sold');
    const stock = bricks.filter(b => b.status === 'In Stock');
    const reserved = bricks.filter(b => b.status === 'Reserved');
    const maintenance = bricks.filter(b => b.status === 'In Maintenance');
    const active = bricks.filter(b => b.status !== 'Sold');

    // Total investido em estoque ativo
    const workingCapital = active.reduce((acc, b) => acc + b.totalInvested, 0);

    // Lucro Acumulado Real: Soma(salePrice - totalInvested - comissão - taxa - frete Venda)
    const accumulatedProfit = sold.reduce((acc, b) => {
      const profit = (b.salePrice || 0) - b.totalInvested - (b.commission || 0) - (b.saleFees || 0) - (b.saleShipping || 0);
      return acc + profit;
    }, 0);

    // Faturamento Total (Valor bruto das vendas)
    const totalRevenue = sold.reduce((acc, b) => acc + (b.salePrice || 0), 0);

    // Ticket Médio de Venda
    const ticketMedio = sold.length > 0 ? Math.round(totalRevenue / sold.length) : 0;

    // ROI Médio % das vendas realizadas
    const averageROI = sold.length > 0
      ? (sold.reduce((acc, b) => {
          const profit = (b.salePrice || 0) - b.totalInvested - (b.commission || 0) - (b.saleFees || 0) - (b.saleShipping || 0);
          return acc + (profit / b.totalInvested) * 100;
        }, 0) / sold.length)
      : 0;

    const totalIn = transactions.filter(t => t.type === 'In').reduce((acc, t) => acc + t.value, 0);
    const totalOut = transactions.filter(t => t.type === 'Out').reduce((acc, t) => acc + t.value, 0);

    // Lucro no mês de Julho/2026 (mês atual de referência nos dados mockados)
    const currentMonthLucro = sold
      .filter(b => b.saleDate && b.saleDate.startsWith('2026-07'))
      .reduce((acc, b) => {
        const profit = (b.salePrice || 0) - b.totalInvested - (b.commission || 0) - (b.saleFees || 0) - (b.saleShipping || 0);
        return acc + profit;
      }, 0);

    const currentYearLucro = sold
      .filter(b => b.saleDate && b.saleDate.startsWith('2026'))
      .reduce((acc, b) => {
        const profit = (b.salePrice || 0) - b.totalInvested - (b.commission || 0) - (b.saleFees || 0) - (b.saleShipping || 0);
        return acc + profit;
      }, 0);

    return {
      currentCapital: 25000 + totalIn - totalOut, // capital total estimado iniciando de R$ 25.000 caixa base
      workingCapital,
      accumulatedProfit,
      totalRevenue,
      averageROI: Math.round(averageROI),
      soldProducts: sold.length,
      stockProducts: stock.length,
      reservedProducts: reserved.length,
      maintenanceProducts: maintenance.length,
      ticketMedio,
      totalIn,
      totalOut,
      currentMonthLucro,
      currentYearLucro,
      balance: totalIn - totalOut
    };
  }, [bricks, transactions]);

  return (
    <BrickContext.Provider value={{ 
      bricks, 
      transactions, 
      goals, 
      addBrick, 
      updateBrick, 
      sellBrick, 
      deleteBrick, 
      addGoal, 
      deleteGoal, 
      addTransaction,
      stats 
    }}>
      {children}
    </BrickContext.Provider>
  );
};

export const useBricks = () => {
  const context = useContext(BrickContext);
  if (!context) throw new Error('useBricks must be used within a BrickProvider');
  return context;
};
