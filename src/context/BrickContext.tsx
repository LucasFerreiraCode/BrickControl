import React, { createContext, useContext, useState, useEffect } from 'react';
import { Brick, Transaction, Goal, financialSummary as initialSummary, goals as initialGoals } from '../data/mockData';

interface BrickContextType {
  bricks: Brick[];
  transactions: Transaction[];
  goals: Goal[];
  addBrick: (brick: Omit<Brick, 'id'>) => void;
  updateBrick: (id: string, brick: Partial<Brick>) => void;
  sellBrick: (id: string, salePrice: number, saleDate: string) => void;
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
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading bricks:', e);
      return [];
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('bt_transactions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading transactions:', e);
      return [];
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
    const brickWithId = { ...newBrick, id: Math.random().toString(36).substr(2, 9) };
    setBricks(prev => [...prev, brickWithId]);
  };

  const updateBrick = (id: string, updatedData: Partial<Brick>) => {
    setBricks(prev => prev.map(b => b.id === id ? { ...b, ...updatedData } : b));
  };

  const sellBrick = (id: string, salePrice: number, saleDate: string) => {
    setBricks(prev => prev.map(b => {
      if (b.id === id) {
        const profit = salePrice - b.purchasePrice - b.fees - b.shipping;
        // Add transaction
        const newTransaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          date: saleDate,
          type: 'In',
          description: `Venda: ${b.name}`,
          value: salePrice
        };
        setTransactions(t => [newTransaction, ...t]);
        return { ...b, salePrice, saleDate, status: 'Sold' as const };
      }
      return b;
    }));
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

  // Dynamic Stats
  const stats = React.useMemo(() => {
    const sold = bricks.filter(b => b.status === 'Sold');
    const inStock = bricks.filter(b => b.status === 'In Stock' || b.status === 'Reserved');
    
    const accumulatedProfit = sold.reduce((acc, b) => {
      return acc + (b.salePrice! - b.purchasePrice - b.fees - b.shipping);
    }, 0);

    const workingCapital = inStock.reduce((acc, b) => acc + b.purchasePrice, 0);
    
    const averageROI = sold.length > 0 
      ? (sold.reduce((acc, b) => {
          const p = b.salePrice! - b.purchasePrice - b.fees - b.shipping;
          return acc + (p / b.purchasePrice) * 100;
        }, 0) / sold.length)
      : 0;

    const totalIn = transactions.filter(t => t.type === 'In').reduce((acc, t) => acc + t.value, 0);
    const totalOut = transactions.filter(t => t.type === 'Out').reduce((acc, t) => acc + t.value, 0);

    return {
      currentCapital: workingCapital + totalIn - totalOut,
      workingCapital,
      accumulatedProfit,
      averageROI: Math.round(averageROI),
      soldProducts: sold.length,
      stockProducts: inStock.length,
      totalIn,
      totalOut,
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
