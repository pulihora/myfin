export class StockPosition {
  constructor() {}
  public symbol: string;
  public shares: number;
  public avgCost: number;
  public totCost: number;
  public latestInfo: Stock;
  public transactions: Transaction[];
  public totgl(): number {
    return this.mktval() - this.totCost;
  }
  public mktval(): number {
    return this.latestInfo.cur_price * this.shares;
  }
  public dailygl(): number {
    return this.shares * this.latestInfo.change;
  }
}
