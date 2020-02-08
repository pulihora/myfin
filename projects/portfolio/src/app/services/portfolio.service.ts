import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  LoadPortfolios(portfolioUri: string) {
    return this.http.get<any>(portfolioUri);
  }
  CreatePortfolio(pname: string, uid: string ) {
    return this.http.post<any>('https://api.myjson.com/bins',
      { uid, pname, pid : '78HG-IU87', transactions : [], cashbalance: 0  }
    );
  }
  UpdateProfile(pData: any, profileUrl: string) {
    return this.http.put<any>(profileUrl, pData);
  }


  getPortfolio(portfolioId: string): Portfolio {
    return JSON.parse(localStorage.getItem('portfolio.' + portfolioId));
  }
  AddTransaction(portfolioId: string, trans: Transaction): Portfolio {
    if (trans != null) {
      let portfolio = JSON.parse(localStorage.getItem('portfolio.' + portfolioId));
      if (portfolio == null) {
        portfolio = {};
        portfolio.pid = portfolioId;
        portfolio.transactions = [];
        portfolio.cashbalance = 0;
      }
      if (trans.transType === 'BUY') {
        portfolio.cashbalance -= trans.quantity * trans.price;
      }
      else if (trans.transType === 'SELL') {
        portfolio.cashbalance += trans.quantity * trans.price;
      }
      portfolio.transactions.push(trans);
      localStorage.setItem('portfolio.' + portfolioId, JSON.stringify(portfolio));
      return portfolio;
    }
    return this.getPortfolio(portfolioId);
  }
  getCurrentPositions(portfolioId: string): StockPosition[] {
    const portfolio = this.getPortfolio(portfolioId);
    let positions: StockPosition[] = [];
    portfolio.transactions.forEach(trans => {
      let symPos = positions.find(p => p.symbol === trans.symbol);
      if (symPos != null) {
        if (trans.transType === "BUY") {
          symPos.shares = Number(symPos.shares) + Number(trans.quantity);
          symPos.totCost += (trans.quantity * trans.price);
        } else {
          symPos.shares = Number(symPos.shares) - Number(trans.quantity);
          symPos.totCost -= (trans.quantity * trans.price);
        }
      }
      else {
        let newPos = {
          symbol: trans.symbol,
          shares: trans.quantity,
          avgCost: 0,
          totCost: trans.quantity * trans.price,
          latestInfo: {
            symbol: trans.symbol,
            cur_price: 0,
            change: 0,
            changePer: 0,
            dividendyield: 0,
            history_prices: null,
            company_name: ''
          }
        };

        positions.push(newPos);
      }
    });
    return positions.filter(p => p.shares > 0);
  }
}
