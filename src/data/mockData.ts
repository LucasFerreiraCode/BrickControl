export interface Brick {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  salePrice?: number;
  fees: number;
  shipping: number;
  purchaseDate: string;
  saleDate?: string;
  status: 'In Stock' | 'Reserved' | 'Sold';
  image: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'In' | 'Out';
  description: string;
  value: number;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  type: 'Profit' | 'Revenue' | 'Capital';
}

// Dados inicializados vazios para uso real
export const mockBricks: Brick[] = [];

export const financialSummary = {
  currentCapital: 0,
  workingCapital: 0,
  accumulatedProfit: 0,
  averageROI: 0,
  soldProducts: 0,
  stockProducts: 0,
};

export const transactions: Transaction[] = [];

export const monthlyEvolution = [
  { month: 'Jan', equity: 0, profit: 0 },
  { month: 'Fev', equity: 0, profit: 0 },
  { month: 'Mar', equity: 0, profit: 0 },
  { month: 'Abr', equity: 0, profit: 0 },
  { month: 'Mai', equity: 0, profit: 0 },
  { month: 'Jun', equity: 0, profit: 0 },
];

export const goals: Goal[] = [
  { id: '1', title: 'Meta de Lucro Mensal', target: 5000, current: 0, type: 'Profit' },
  { id: '2', title: 'Meta de Faturamento', target: 15000, current: 0, type: 'Revenue' },
  { id: '3', title: 'Evolução de Capital', target: 20000, current: 0, type: 'Capital' },
];
