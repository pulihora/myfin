import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { timer } from 'rxjs/internal/observable/timer';
import { StockPosition } from '../models/StockPosition';

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
    this.dataStore = JSON.parse(localStorage.getItem('stocksDS')) || { stocks: [] };
    if (symbols != null && symbols.length > 0) {
      symbols.forEach(sym => this.addSymbolToDataStore(sym));
    }
    this.stocksStream.next(Object.assign({}, this.dataStore).stocks);
  }

  addSymbolToDataStore(sym: string) {
    if (this.dataStore.stocks && this.dataStore.stocks.length < 101) {
      if (!this.dataStore.stocks.find(s => s.symbol === sym)) {
        const currStk: Stock = {
          symbol: '', cur_price: null, change: null, changePer: null, dividendyield: null,
          history_prices: null, company_name: ''
        };
        currStk.symbol = sym;
        this.dataStore.stocks.push(currStk);
      }
    } else {
      throw new Error('Max capacity reached for stocks');
    }
  }
  getEODValue(positions: StockPosition[], asOfDate: Date): number {
    if (positions && positions.length > 0) {
      let totMktVal = 0;
      positions.forEach(p => {
        const cPrice = this.getClosingPrice( p.symbol, asOfDate) * p.shares;
        if (cPrice > 0) {
          totMktVal += cPrice;
        }
      });
      return totMktVal;
    }
    return 0;
  }
  getClosingPrice(symbol: string, asOfDate: Date): number {
    if (symbol && asOfDate && symbol.length > 0 && asOfDate < new Date()) {
      const histData = JSON.parse(localStorage.getItem(symbol + '_100HIST'));
      if(histData) {
        const res =  histData.find(sh => new Date(sh.date) <= asOfDate);
        return res.price;
      }
    }
    return 0;
  }
  getStocks(): Observable<Stock[]> {
    return this.stocksStream.asObservable();
  }
  startHistoryBOT(): void {
    this.dataStore.stocks.forEach(this.delayLoop(this.getHistoricalData, 20000));
  }
  getHistoricalData(stock: Stock, hClient) {
    const lsHistData = JSON.parse(localStorage.getItem(stock.symbol + '_100HIST'));
    let latestHistData = null;
    let loadHistData = true;
    if (lsHistData) {

      let todayDate = new Date();
      latestHistData =  lsHistData.find(sh => ( new Date(sh.date).getDate() === todayDate.getDate()
                                                && new Date(sh.date).getMonth() === todayDate.getMonth()
                                                && new Date(sh.date).getFullYear() === todayDate.getFullYear()
                                              )
                                        );
      if(latestHistData && latestHistData.price > 0) {
        loadHistData = false;
        console.log(stock.symbol + ' hist data found and price exist');
      }
    }
    if (loadHistData) {
      console.log();
      hClient.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='
      + stock.symbol.replace('.', '-') + '&apikey=O22XVPSPMRTX7OGT')
      .subscribe((res: any) => {
        let histData: StockHistory[] = [];
        // tslint:disable-next-line:forin
        for (const key in res['Time Series (Daily)']) {
          histData.push({date: new Date(Number(key.split('-')[0]), Number(key.split('-')[1]) - 1 , Number(key.split('-')[2])),
                  price: res['Time Series (Daily)'][key]['4. close'] });
        }
        if(histData.length > 0) {
          localStorage.setItem(stock.symbol + '_100HIST', JSON.stringify(histData));
        }
      });
    }
  }
  delayLoop = (fn, delay) => {
    return (stock, i) => {
      setTimeout(() => {
        fn(stock, this.httpClient);
      }, i * delay);
    };
  }

  startBOT(): void {
    console.log('BOT started');
    this.timersubscription = timer(1000, 60000).subscribe(t => {
      const combinedstocks = this.dataStore.stocks.map(e => e.symbol).join('|');
      this.httpClient.get('https://quote.cnbc.com/quote-html-webservice/quote.htm?symbols=' + combinedstocks + '&exthrs=1&output=json')
        .subscribe((res: any) => {
          this.dataStore.stocks.forEach(stk => {
            const resSym = res.QuickQuoteResult.QuickQuote.find(stock => stock.symbol === stk.symbol);
            if ((stk.cur_price && stk.cur_price !== resSym.last) || stk.history_prices === null) {
              stk.history_prices = stk.history_prices || [];
              const prevPrice: StockHistory = { date: new Date(), price: stk.cur_price };
              if (stk && stk.history_prices) {
                if (stk.history_prices.length > 0 &&
                  (stk.history_prices[stk.history_prices.length - 1].price !== prevPrice.price)
                ) {
                  stk.history_prices.push(prevPrice);
                }
              }
            }
            if (resSym.curmktstatus === 'POST_MKT') {
              stk.cur_price = Number(resSym.todays_closing);
            } else {
              stk.cur_price = Number(resSym.last);
            }
            stk.change = resSym.change;
            stk.changePer = resSym.change_pct;
            if (resSym.FundamentalData) {
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
