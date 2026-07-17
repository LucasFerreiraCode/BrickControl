export interface Brick {
  id: string;
  brand: string;
  model: string;
  name: string;
  storage: string;
  color: string;
  imei?: string;
  condition: 'Novo' | 'Excelente' | 'Bom' | 'Com Marcas' | 'Quebrado';
  batteryHealth?: number;
  defect?: string;
  accessories: string[];
  purchaseDate: string;
  purchasePrice: number;
  maintenanceCost: number;
  shippingCost: number;
  additionalCosts: number;
  totalInvested: number;
  status: 'In Stock' | 'Reserved' | 'Sold' | 'In Maintenance';
  image: string;

  // Vendas
  salePrice?: number;
  saleDate?: string;
  paymentMethod?: 'Pix' | 'Cartão' | 'Dinheiro' | 'Outro';
  commission?: number;
  saleFees?: number;
  saleShipping?: number;
  client?: string;
  observations?: string;
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

// Dados iniciais reais para o revendedor de eletrônicos começar com o painel populado
export const mockBricks: Brick[] = [
  {
    id: "ele-101",
    brand: "Apple",
    model: "iPhone 13 Pro",
    name: "Apple iPhone 13 Pro 128GB - Grafite",
    storage: "128GB",
    color: "Grafite",
    imei: "354928102938475",
    condition: "Excelente",
    batteryHealth: 86,
    accessories: ["Carregador", "Cabo", "Caixa"],
    purchaseDate: "2026-06-15",
    purchasePrice: 2400,
    maintenanceCost: 0,
    shippingCost: 35,
    additionalCosts: 0,
    totalInvested: 2435,
    status: "Sold",
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=600",
    salePrice: 3200,
    saleDate: "2026-07-02",
    paymentMethod: "Pix",
    commission: 0,
    saleFees: 0,
    saleShipping: 20,
    client: "Carlos Eduardo",
    observations: "Vendido diretamente pelo Instagram."
  },
  {
    id: "ele-102",
    brand: "Apple",
    model: "iPhone 11",
    name: "Apple iPhone 11 64GB - Preto",
    storage: "64GB",
    color: "Preto",
    imei: "358273619283745",
    condition: "Bom",
    batteryHealth: 78,
    defect: "Saúde da bateria baixa",
    accessories: ["Cabo"],
    purchaseDate: "2026-06-25",
    purchasePrice: 1100,
    maintenanceCost: 250, // Troca de bateria
    shippingCost: 0,
    additionalCosts: 20,
    totalInvested: 1370,
    status: "Sold",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600",
    salePrice: 1950,
    saleDate: "2026-07-10",
    paymentMethod: "Cartão",
    commission: 0,
    saleFees: 78, // Taxa maq
    saleShipping: 0,
    client: "Mariana Silva",
    observations: "Substituída bateria por uma nova homologada. Saúde 100%."
  },
  {
    id: "ele-103",
    brand: "Samsung",
    model: "Galaxy S23 Ultra",
    name: "Samsung Galaxy S23 Ultra 256GB - Verde",
    storage: "256GB",
    color: "Verde",
    imei: "359918237462839",
    condition: "Excelente",
    batteryHealth: 94,
    accessories: ["Carregador", "Cabo", "Caneta S-Pen"],
    purchaseDate: "2026-07-01",
    purchasePrice: 3200,
    maintenanceCost: 0,
    shippingCost: 40,
    additionalCosts: 0,
    totalInvested: 3240,
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "ele-104",
    brand: "Apple",
    model: "iPhone 14 Pro Max",
    name: "Apple iPhone 14 Pro Max 256GB - Roxo Escuro",
    storage: "256GB",
    color: "Roxo Escuro",
    imei: "351293847562019",
    condition: "Novo",
    batteryHealth: 100,
    accessories: ["Completo na Caixa"],
    purchaseDate: "2026-07-05",
    purchasePrice: 4800,
    maintenanceCost: 0,
    shippingCost: 50,
    additionalCosts: 100, // Película + Capinha de Brinde
    totalInvested: 4950,
    status: "Reserved",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&q=80&w=600",
    client: "Rodrigo Almeida"
  },
  {
    id: "ele-105",
    brand: "Xiaomi",
    model: "Redmi Note 12",
    name: "Xiaomi Redmi Note 12 128GB - Azul",
    storage: "128GB",
    color: "Azul",
    imei: "357283910293847",
    condition: "Com Marcas",
    defect: "Tampa traseira riscada",
    accessories: ["Carregador", "Cabo"],
    purchaseDate: "2026-07-08",
    purchasePrice: 650,
    maintenanceCost: 120, // polimento traseiro
    shippingCost: 20,
    additionalCosts: 0,
    totalInvested: 790,
    status: "In Maintenance",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600"
  }
];

export const financialSummary = {
  currentCapital: 25000,
  workingCapital: 8980,
  accumulatedProfit: 1345,
  averageROI: 42,
  soldProducts: 2,
  stockProducts: 3,
};

export const transactions: Transaction[] = [
  { id: "t-1", date: "2026-06-15", type: "Out", description: "Compra: iPhone 13 Pro 128GB", value: 2400 },
  { id: "t-2", date: "2026-06-15", type: "Out", description: "Frete: iPhone 13 Pro", value: 35 },
  { id: "t-3", date: "2026-06-25", type: "Out", description: "Compra: iPhone 11 64GB", value: 1100 },
  { id: "t-4", date: "2026-06-27", type: "Out", description: "Manutenção: Bateria iPhone 11", value: 250 },
  { id: "t-5", date: "2026-07-01", type: "Out", description: "Compra: Galaxy S23 Ultra", value: 3200 },
  { id: "t-6", date: "2026-07-01", type: "Out", description: "Frete: Galaxy S23 Ultra", value: 40 },
  { id: "t-7", date: "2026-07-02", type: "In", description: "Venda: iPhone 13 Pro 128GB", value: 3200 },
  { id: "t-8", date: "2026-07-05", type: "Out", description: "Compra: iPhone 14 Pro Max", value: 4800 },
  { id: "t-9", date: "2026-07-08", type: "Out", description: "Compra: Redmi Note 12", value: 650 },
  { id: "t-10", date: "2026-07-10", type: "In", description: "Venda: iPhone 11 64GB", value: 1950 }
];

export const monthlyEvolution = [
  { month: 'Fev', equity: 18000, profit: 900 },
  { month: 'Mar', equity: 20200, profit: 1200 },
  { month: 'Abr', equity: 22000, profit: 1800 },
  { month: 'Mai', equity: 23100, profit: 1100 },
  { month: 'Jun', equity: 24700, profit: 1600 },
  { month: 'Jul', equity: 28415, profit: 3715 },
];

export const goals: Goal[] = [
  { id: '1', title: 'Meta de Lucro Mensal', target: 5000, current: 3715, type: 'Profit' },
  { id: '2', title: 'Meta de Faturamento', target: 15000, current: 5150, type: 'Revenue' },
  { id: '3', title: 'Evolução de Capital', target: 35000, current: 28415, type: 'Capital' },
];
