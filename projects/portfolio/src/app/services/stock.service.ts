import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { timer } from 'rxjs/internal/observable/timer';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  // a stream for new assets
  private stocksStream: BehaviorSubject<Stock[]>;
  private currentStockStream: Subject<Stock>;
  private timersubscription: any;

  private dataStore: {  // This is where we will store our data in memory
    stocks: Stock[]
  };

  constructor(private httpClient: HttpClient) {
    this.dataStore = { stocks: [] };
    this.stocksStream = new BehaviorSubject<Stock[]>([]);
    this.currentStockStream = new Subject<Stock>();
  }

  // initial load
  loadStocks(symbols: string[]): void {
    this.dataStore = JSON.parse(localStorage.getItem('stocksDS')) || {stocks:[]};
    if(symbols != null && symbols.length > 0){
      symbols.forEach(sym => this.addSymbolToDataStore(sym));
    }
    this.stocksStream.next(Object.assign({}, this.dataStore).stocks);
  }

  addSymbolToDataStore(sym: string){
    if(!this.dataStore.stocks.find(s => s.symbol === sym)){
      const currStk: Stock = {symbol: '', cur_price: null, change: null, changePer: null, dividendyield: null,
                             history_prices: null, company_name: ''};
      currStk.symbol = sym;
      this.dataStore.stocks.push(currStk);
    }
  }

  getStocks(): Observable<Stock[]> {
    return this.stocksStream.asObservable();
  }

  startBOT(): void {
    console.log('BOT started');
    this.timersubscription = timer(1000, 60000).subscribe(t => {
      const combinedstocks =  this.dataStore.stocks.map(e => e.symbol).join('|');
      this.httpClient.get('https://quote.cnbc.com/quote-html-webservice/quote.htm?symbols=' + combinedstocks + '&exthrs=1&output=json')
      .subscribe( (res: any) => {
        this.dataStore.stocks.forEach(stk =>{
                let resSym = res.QuickQuoteResult.QuickQuote.find(stock => stock.symbol === stk.symbol);
                if((stk.cur_price &&  stk.cur_price !== resSym.last) || stk.history_prices === null ){
                  stk.history_prices = stk.history_prices || [];
                  let prevPrice : StockHistory = { date: new Date(), price: stk.cur_price};
                  stk.history_prices.push(prevPrice);
                }
                stk.cur_price = Number(resSym.last);
                stk.change = resSym.change;
                stk.changePer = resSym.change_pct;
                if(resSym.FundamentalData){
                  stk.dividendyield = resSym.FundamentalData.dividendyield;
                }
                stk.company_name = resSym.name;
              }
              );
        localStorage.setItem('stocksDS', JSON.stringify(this.dataStore));
        this.stocksStream.next(Object.assign({}, this.dataStore).stocks);
      });
    });
  }
  // update a stock
  updateStock(stockUpdated: Stock) {
    const body = JSON.stringify(stockUpdated);
  }


  setCurrentStock(stock: Stock) {
    this.currentStockStream.next(stock);
  }

  getCurrentStock(): Observable<Stock> {
    return this.currentStockStream.asObservable();
  }
}
