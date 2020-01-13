import { Component, OnInit, Input } from '@angular/core';
import { StockService } from '../services/stock.service';
import { Observable } from 'rxjs';
import { PortfolioService } from '../services/portfolio.service';
import { ActivatedRoute } from '@angular/router';

import * as $ from 'jquery';
import * as CanvasJS from '../../assets/canvasjs.min';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  dataPoints: any;
  dpsLength: number = 0;
  chart: any;
  stocks: Observable<Stock[]>;
  portfolio: Portfolio;
  positions: StockPosition[];
  private sub: any;
  pid: string;

  DLTot: number;
  MktTotl: number;
  TotGL: number;
  TotCost: number;
  constructor(private stockService: StockService, private portfolioSrv: PortfolioService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.dataPoints = [];
    this.chart = new CanvasJS.Chart("chartContainer", {
      exportEnabled: true,
      title: {
        text: "Live Chart"
      },
      axisY: {
        minimum: 360000
        //   maximum: 90
      },
      data: [{
        type: "splineArea",
        color: "rgba(54,158,173,.7)",
        // xValueFormatString: "HH:mm",
        dataPoints: this.dataPoints,
      }]
    });

    this.sub = this.route.params.subscribe(params => {
      this.pid = params['pid'];
      this.portfolio = this.portfolioSrv.getPortfolio(this.pid);

      this.positions = this.portfolioSrv.getCurrentPositions(this.pid);
      this.stockService.loadStocks(this.positions.map(ele => ele.symbol));
      this.stockService.getStocks().subscribe(stocks => {
        this.updateStockInfo(stocks);
      });
      this.stockService.startBOT();
    });
  }

  updateChart() {
    // this.chart.axisY = { minimum:this.getMin(this.dataPoints)};
    this.chart.render();
  }
  getMin(a) {
    var min = a[0][0][1];
    for (var i = 0; i < a[0].length; i++) {
      if (a[0][i][1] < min)
        min = a[0][i][1];
    }
    return min;
  }
  updateStockInfo(stocks: Stock[]) {
    this.DLTot = 0;
    this.MktTotl = 0;
    this.TotGL = 0;
    this.TotCost = 0;
    this.positions.forEach(pos => {
      pos.latestInfo = stocks.find(s => s.symbol === pos.symbol);
      this.DLTot += pos.shares * pos.latestInfo.change;
      this.MktTotl += pos.shares * pos.latestInfo.cur_price;
      this.TotGL += pos.latestInfo.cur_price * pos.shares - pos.totCost;
      this.TotCost += pos.totCost;
    });
    var date = new Date();
    this.dataPoints.push({
      x: new Date(date.setMonth(date.getMonth() + 8)),
      y: (this.MktTotl + this.portfolio.cashbalance)
    });
    this.dpsLength++;
    this.updateChart();


    this.positions.sort( (a, b) => a.shares * a.latestInfo.change - b.shares * b.latestInfo.change);
    // this.positions.sort( function(a, b){return a.latestInfo.cur_price * a.shares - b.latestInfo.cur_price * b.shares} )
    // this.positions.sort( function(a, b){return (( a.latestInfo.cur_price * a.shares - a.totCost)/ a.totCost) -
    // (( b.latestInfo.cur_price * b.shares - b.totCost)/ b.totCost)  });
  }
}
