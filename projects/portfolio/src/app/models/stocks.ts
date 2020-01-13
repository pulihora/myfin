interface StockHistory {
  date: Date;
  price: number;
}

interface Stock {
  symbol: string;
  cur_price: number;
  change: number;
  changePer: number;
  history_prices: StockHistory[];
  company_name: string;
  dividendyield: number;
}
