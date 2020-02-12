import { Component, OnInit, Input } from '@angular/core';
import { StockService } from '../services/stock.service';
import { Observable } from 'rxjs';
import { PortfolioService } from '../services/portfolio.service';
import { ActivatedRoute } from '@angular/router';
import { formatNumber } from '@angular/common';
import * as CanvasJS from '../../assets/canvasjs.min';
import { StockPosition } from '../models/StockPosition';
import { GridOptions, GridOptionsWrapper } from 'ag-grid-community';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  dataPoints: any;
  dpsLength = 0;
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

  private gridApi;
  private gridColumnApi;
  public gridOptions: GridOptions;
  columnDefs = [
    {headerName: 'Name', field: 'latestInfo.company_name', sortable: true },
    {headerName: 'Tot Cost', field: 'totCost' , valueFormatter: this.numFormatter, sortable: true},
    {headerName: 'Mkt Val', field: 'mktval' , sortable: true,
                  valueGetter(params) { return params.data.mktval(); }, valueFormatter: this.numFormatter},
    {headerName: 'Tot G/L', field: 'totgl', sortable: true,
                  valueGetter(params) { return params.data.totgl(); }, valueFormatter: this.numFormatter},
    {headerName: 'Shares', field: 'shares', sortable: true},
    {headerName: 'Div', field: 'latestInfo.dividendyield',
                  valueGetter(params) { return (params.data.latestInfo.dividendyield ? params.data.latestInfo.dividendyield : 0) * 100; },
                  valueFormatter: this.numFormatter, sortable: true},
    {headerName: 'Price', field: 'latestInfo.cur_price', sortable: true},
    {headerName: 'Daily G/L', field: 'dailygl', sortable: true,
                  valueGetter(params) { return params.data.dailygl(); }, valueFormatter: this.numFormatter,
                  valueParser: this.numberParser,
                  cellClassRules: {
                    'rag-green': 'x > 0',
                    'rag-red': 'x < 0'
                  }
                },
  ];

  rowData = [
  ];
   numFormatter(params) {
     return formatNumber(params.value, 'en-US', '1.2-2');
  }
  constructor(private stockService: StockService, private portfolioSrv: PortfolioService, private route: ActivatedRoute) {

  }
  numberParser(params) {
    const newValue = params.newValue;
    let valueAsNumber;
    if (newValue === null || newValue === undefined || newValue === '') {
      valueAsNumber = null;
    } else {
      valueAsNumber = parseFloat(params.newValue);
    }
    return valueAsNumber;
  }
  ngOnInit() {

    this.gridOptions = { suppressHorizontalScroll:true};
    this.dataPoints = [];
    this.chart = new CanvasJS.Chart('chartContainer', {
      exportEnabled: true,
      title: {
        text: 'Live Chart'
      },
      axisY: {
        minimum: 377000
        //   maximum: 90
      },
      data: [{
        type: 'splineArea',
        color: 'rgba(54,158,173,.7)',
        // xValueFormatString: "HH:mm",
        dataPoints: this.dataPoints,
      }]
    });

    this.sub = this.route.params.subscribe(params => {
      this.pid = params.pid;
      this.portfolioSrv.getPortfolio(this.pid).subscribe(portfolioData => {
        console.log(portfolioData);
        this.portfolio = portfolioData;
        this.positions = this.portfolioSrv.getCurrentPositions(portfolioData);
        this.stockService.loadStocks(this.positions.map(ele => ele.symbol));
        this.stockService.getStocks().subscribe(stocks => {
          this.updateStockInfo(stocks);
        });
        this.stockService.startBOT();
      });
    });

  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  updateChart() {
    // this.chart.axisY = { minimum: this.getMin(this.dataPoints)};
    this.chart.render();
  }
  getMin(a) {
    if(a[0][0]){
      let min = a[0][0][1];
      for (const e of a[0]) {
        if (e[1] < min) {
          min = e[1];
        }
      }
      return min;
    }
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
    this.rowData = this.positions;
    const date = new Date();
    this.dataPoints.push({
      x: new Date(date.setMonth(date.getMonth() + 8)),
      y: (this.MktTotl + this.portfolio.cashbalance)
    });
    console.log(this.dataPoints);
    this.dpsLength++;
    this.updateChart();
    // this.positions.sort((a, b) => (a.shares * a.latestInfo.change) - (b.shares * b.latestInfo.change));
  }
  updatePortfolio(eData) {
    console.log(eData);
    this.portfolioSrv.AddTransaction(this.pid, this.portfolio, eData).subscribe( d => {
      this.portfolio = d;
      this.positions = this.portfolioSrv.getCurrentPositions(d);
      this.stockService.loadStocks(this.positions.map(ele => ele.symbol));
    } );
  }
}
