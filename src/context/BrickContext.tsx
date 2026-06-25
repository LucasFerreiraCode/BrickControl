import React, { createContext, useContext, useState, useEffect } from 'react';
import { Brick, Transaction, financialSummary as initialSummary, goals as initialGoals } from '../data/mockData';

interface BrickContextType {
  bricks: Brick[];
  transactions: Transaction[];
  goals: any[];
  addBrick: (brick: Omit<Brick, 'id'>) => void;
  sellBrick: (id: string, salePrice: number, saleDate: string) => void;
  deleteBrick: (id: string) => void;
  stats: typeof initialSummary;
}

const BrickContext = createContext<BrickContextType | undefined>(undefined);

export const BrickProvider = ({ children }: { children: React.ReactNode }) => {
  const [bricks, setBricks] = useState<Brick[]>(() => {
    const saved = localStorage.getItem('bt_bricks');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bt_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<any[]>(() => {
    const saved = localStorage.getItem('bt_goals');
    return saved ? JSON.parse(saved) : initialGoals;
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

    return {
      currentCapital: workingCapital + accumulatedProfit, // Simplificado
      workingCapital,
      accumulatedProfit,
      averageROI: Math.round(averageROI),
      soldProducts: sold.length,
      stockProducts: inStock.length
    };
  }, [bricks]);

  return (
    <BrickContext.Provider value={{ bricks, transactions, goals, addBrick, sellBrick, deleteBrick, stats }}>
      {children}
    </BrickContext.Provider>
  );
};

export const useBricks = () => {
  const context = useContext(BrickContext);
  if (!context) throw new Error('useBricks must be used within a BrickProvider');
  return context;
};
