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

export const mockBricks: Brick[] = [
  {
    id: '1',
    name: 'iPhone 13 128GB',
    category: 'Smarphones',
    purchasePrice: 1500,
    salePrice: 2100,
    fees: 50,
    shipping: 20,
    purchaseDate: '2026-05-10',
    saleDate: '2026-05-15',
    status: 'Sold',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: '2',
    name: 'PlayStation 5',
    category: 'Games',
    purchasePrice: 2500,
    salePrice: 3200,
    fees: 100,
    shipping: 50,
    purchaseDate: '2026-05-12',
    saleDate: '2026-05-20',
    status: 'Sold',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: '3',
    name: 'Galaxy S23 Ultra',
    category: 'Smarphones',
    purchasePrice: 1800,
    salePrice: 2400,
    fees: 60,
    shipping: 25,
    purchaseDate: '2026-05-20',
    saleDate: '2026-05-25',
    status: 'Sold',
    image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: '4',
    name: 'MacBook Air M2',
    category: 'Laptops',
    purchasePrice: 4500,
    fees: 150,
    shipping: 40,
    purchaseDate: '2026-06-05',
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ec696e5237?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: '5',
    name: 'Nintendo Switch OLED',
    category: 'Games',
    purchasePrice: 1200,
    salePrice: 1800,
    fees: 40,
    shipping: 20,
    purchaseDate: '2026-06-01',
    status: 'Reserved',
    image: 'https://images.unsplash.com/photo-1578303372704-14f0643e0c47?auto=format&fit=crop&q=80&w=200',
  },
];

export const financialSummary = {
  currentCapital: 12500,
  workingCapital: 8200,
  accumulatedProfit: 4850,
  averageROI: 38,
  soldProducts: 47,
  stockProducts: 12,
};

export const transactions: Transaction[] = [
  { id: '1', date: '2026-06-25', type: 'In', description: 'Venda iPhone 13', value: 2100 },
  { id: '2', date: '2026-06-24', type: 'Out', description: 'Compra Galaxy S23', value: 1800 },
  { id: '3', date: '2026-06-23', type: 'Out', description: 'Frete Sedex', value: 45 },
  { id: '4', date: '2026-06-22', type: 'Out', description: 'Taxa Marketplace', value: 120 },
];

export const monthlyEvolution = [
  { month: 'Jan', equity: 5000, profit: 800 },
  { month: 'Fev', equity: 6200, profit: 1200 },
  { month: 'Mar', equity: 7500, profit: 950 },
  { month: 'Abr', equity: 9000, profit: 1500 },
  { month: 'Mai', equity: 11200, profit: 2200 },
  { month: 'Jun', equity: 12500, profit: 1300 },
];

export const goals: Goal[] = [
  { id: '1', title: 'Meta de Lucro Mensal', target: 5000, current: 3600, type: 'Profit' },
  { id: '2', title: 'Meta de Faturamento', target: 15000, current: 10500, type: 'Revenue' },
  { id: '3', title: 'Evolução de Capital', target: 20000, current: 12500, type: 'Capital' },
];
