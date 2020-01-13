import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor() { }

  getPortfolio(portfolioId: string): Portfolio {
    return JSON.parse(localStorage.getItem('portfolio.' + portfolioId));
  }
  AddTransaction(portfolioId: string, trans: Transaction): Portfolio {    
    if(trans != null){
      let portfolio = JSON.parse(localStorage.getItem('portfolio.' + portfolioId));
      if(portfolio == null){
        portfolio = {};
        portfolio.pid = portfolioId;
        portfolio.transactions = [];
        portfolio.cashbalance = 0;
      }
      if(trans.transType === 'BUY'){
        portfolio.cashbalance -= trans.quantity * trans.price;
      }
      else if(trans.transType === 'SELL'){
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
      if(symPos != null) {
        if(trans.transType === "BUY"){
          symPos.shares = Number(symPos.shares) + Number(trans.quantity);
          symPos.totCost += (trans.quantity * trans.price);
        }else{
          symPos.shares = Number(symPos.shares) - Number(trans.quantity);
          symPos.totCost -= (trans.quantity * trans.price);
        }
      }
      else{
        let newPos ={
          symbol: trans.symbol,
          shares: trans.quantity,
          avgCost: 0,
          totCost: trans.quantity * trans.price,
          latestInfo: {symbol: trans.symbol,
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
    return positions.filter(p=>p.shares>0);
  }
}
