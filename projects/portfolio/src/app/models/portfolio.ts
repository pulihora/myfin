interface Portfolio {
  uid: string;
  pid: string;
  pname: string;
  transactions: Transaction[];
  cashbalance: number;
}


interface Transaction {
  id: string;
  date: Date;
  symbol: string;
  quantity: number;
  price: number;
  transType: string;
}
