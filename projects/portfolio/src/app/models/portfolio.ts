interface Portfolio {
  pid: string;
  transactions: Transaction[];
  cashbalance: number;
}
interface StockPosition {
  symbol: string;
  shares: number;
  avgCost: number;
  totCost: number;
  latestInfo : Stock;
}

interface Transaction {
  id: string;
  date: Date;
  symbol: string;
  quantity: number;
  price: number;
  transType: string;
}
