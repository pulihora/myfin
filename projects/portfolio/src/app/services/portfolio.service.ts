import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StockPosition } from '../models/StockPosition';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor(private http: HttpClient) { }

  getPortfolioUrl(uid: string) {
    return this.http.post<any>(
      'https://userportfolio.azurewebsites.net/api/GetMyPortfoliosUrl?code=wE7l3brjnAuqTa53qikh/U6aq7Q0nf9Sdd2Ia510vgbBIsTHyvcimA==',
      { uid }
    );
  }
  InitUser(uid: string) {
    return this.http.post<any>('https://api.myjson.com/bins',
      { uid, portfolios: [] }
    );
  }
  AddUserMapping(uid: string, portfolioUrl: string) {
    return this.http.post<any>(
      'https://userportfolio.azurewebsites.net/api/AddUserPortfolioUrl?code=uCVb5ZlaFBuIGKGCjskNKN3auW7DiZXWcV5RxsAkcie6sHnIOSZBsQ==',
      { uid, portfolio_url: portfolioUrl }
    );
  }
  LoadPortfolios(profilrUrl: string) {
    return this.http.get<any>(profilrUrl);
  }
  CreatePortfolio(pname: string, uid: string ) {
    return this.http.post<any>('https://api.myjson.com/bins',
      { uid, pname, pid : '78HG-IU87', transactions : [], cashbalance: 0  }
    );
  }
  UpdateProfile(pData: any, profileUrl: string) {
    return this.http.put<any>(profileUrl, pData);
  }
  getPortfolio(portfolioId: string) {
    return this.http.get<any>('https://api.myjson.com/bins/' + portfolioId);
  }
  AddTransaction(portfolioId: string, portfolio: Portfolio, trans: Transaction) {
    portfolio.transactions = portfolio.transactions || [];
    portfolio.transactions.push(trans);
    return this.http.put<any>('https://api.myjson.com/bins/' + portfolioId, portfolio);
  }
  uuidv4() {
    return 'xxxxxxxx'.replace(/[xy]/g,
      c => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  getCurrentPositions(portfolio: Portfolio): StockPosition[] {
    const positions: StockPosition[] = [];
    portfolio.transactions.forEach(trans => {
      const symPos = positions.find(p => p.symbol === trans.symbol);
      if (symPos != null) {
        if (trans.transType === 'BUY') {
          symPos.shares = Number(symPos.shares) + Number(trans.quantity);
          symPos.totCost += (trans.quantity * trans.price);
        } else {
          symPos.shares = Number(symPos.shares) - Number(trans.quantity);
          symPos.totCost -= (trans.quantity * trans.price);
        }
      } else {
        let newPos: StockPosition = new StockPosition();
        newPos.symbol =  trans.symbol;
        newPos.shares = trans.quantity;
        newPos.avgCost = 0;
        newPos.totCost = trans.quantity * trans.price;
        newPos.latestInfo = {
              symbol: trans.symbol,
              cur_price: 0,
              change: 0,
              changePer: 0,
              dividendyield: 0,
              history_prices: null,
              company_name: ''
            };
        positions.push(newPos);
      }
    });
    return positions.filter(p => p.shares > 0);
  }
}
