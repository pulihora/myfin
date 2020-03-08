import { Component, OnInit, Input } from '@angular/core';
import { StockService } from '../services/stock.service';
import { Observable } from 'rxjs';
import { PortfolioService } from '../services/portfolio.service';
import { ActivatedRoute } from '@angular/router';
import { formatNumber } from '@angular/common';
import { StockPosition } from '../models/StockPosition';
import { GridOptions, GridOptionsWrapper } from 'ag-grid-community';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

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
  sideBar;
  defaultColDef;
  columnDefs = [
    { headerName: 'Name', field: 'latestInfo.company_name', sortable: true,
    valueGetter(params) { return params.data.transactions.length + ' ' + params.data.latestInfo.company_name ; },
        filter: 'agTextColumnFilter'
    },
    { headerName: 'Tot Cost', field: 'totCost', valueFormatter: this.numFormatter, sortable: true },
    {
      headerName: 'Mkt Val', field: 'mktval', sortable: true,
      valueGetter(params) { return params.data.mktval(); }, valueFormatter: this.numFormatter
    },
    {
      headerName: 'Tot G/L', field: 'totgl', sortable: true,
      valueGetter(params) { return params.data.totgl(); }, valueFormatter: this.numFormatter
    },
    { headerName: 'Shares', field: 'shares', sortable: true },
    {
      headerName: 'Div', field: 'latestInfo.dividendyield',
      valueGetter(params) { return (params.data.latestInfo.dividendyield ? params.data.latestInfo.dividendyield : 0) * 100; },
      valueFormatter: this.numFormatter, sortable: true
    },
    { headerName: 'Price', field: 'latestInfo.cur_price', sortable: true },
    {
      headerName: 'Daily G/L', field: 'dailygl', sortable: true,
      valueGetter(params) { return params.data.dailygl(); }, valueFormatter: this.numFormatter,
      cellClassRules: {
        'rag-green': 'x > 0',
        'rag-red': 'x < 0'
      }
    },
  ];
  rowData = [
  ];
  lineChartData: ChartDataSets[] = [
    { data: [], fill: 'origin', label: 'Total' },
    { data: [], fill: 'origin', label: 'Previous Total' },
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'green',
      backgroundColor: 'rgba(0,150,0,0.28)',
    }, {
      borderColor: 'grey',
      backgroundColor: 'rgba(150,0,0,0.28)',
    }
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';



  lineChartData2: ChartDataSets[] = [
    { data: [], label: 'Total' }
  ];

  lineChartLabels2: Label[] = [];

  lineChartOptions2 = {
    responsive: true,
    maintainAspectRatio: false
  };

  lineChartColors2: Color[] = [
    {
      borderColor: 'grey',
      backgroundColor: 'rgba(200,200,200,0.28)',
    }
  ];

  lineChartLegend2 = true;
  lineChartPlugins2 = [];
  lineChartType2 = 'line';






  public doughnutChartLabels: Label[] = [];
  public doughnutChartData: MultiDataSet = [
    []
  ];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutBackgroundColors = [{backgroundColor: ['#e84351', '#434a54', '#3ebf9b', '#4d86dc', '#f3af37']}];

  numFormatter(params) {
    return formatNumber(params.value, 'en-US', '1.2-2');
  }
  constructor(private stockService: StockService, private portfolioSrv: PortfolioService, private route: ActivatedRoute) {

  }
  ngOnInit() {

    this.gridOptions = { suppressHorizontalScroll: true };
    this.sideBar = 'filters';
    this.defaultColDef = { filter: true };
    this.sub = this.route.params.subscribe(params => {
      this.pid = params.pid;
      this.portfolioSrv.getPortfolio(this.pid).subscribe(portfolioData => {
        console.log(portfolioData);
        this.portfolio = portfolioData;
        this.positions = this.portfolioSrv.getCurrentPositions(portfolioData);
        console.log(this.positions);
        this.stockService.loadStocks(this.positions.map(ele => ele.symbol));
        this.stockService.getStocks().subscribe(stocks => {
          this.updateStockInfo(stocks);
        });
        this.stockService.startBOT();
        this.stockService.startHistoryBOT();
        this.LoadHistory(portfolioData);
      });
    });

  }
  LoadHistory(portfolioData: Portfolio) {
    for(let i = 100; i >=0; i--) {
      let todayDate = new Date();
      let histDate = new Date();
      histDate.setTime(todayDate.getTime() - (i * 24 * 3600000));
      let testp = this.portfolioSrv.getPositionsOn(portfolioData, histDate );
      if(this.stockService.getEODValue(testp, histDate) > 0) {
        this.lineChartData2[0].data.push(this.stockService.getEODValue(testp, histDate));
        this.lineChartLabels2.push( (histDate.getMonth() + 1) + '/' + histDate.getDate() );
      }
      // console.log(histDate + ' ' + this.stockService.getEODValue(testp, histDate));
    }
  }
  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }
  getMin(a) {
    if (a[0][0]) {
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
    this.doughnutChartData = [
      []
    ];
    this.doughnutBackgroundColors[0].backgroundColor = [];
    this.doughnutChartLabels = [];
    this.positions.forEach(pos => {
      pos.latestInfo = stocks.find(s => s.symbol === pos.symbol);
      this.DLTot += pos.shares * pos.latestInfo.change;
      this.MktTotl += pos.shares * pos.latestInfo.cur_price;
      this.TotGL += pos.latestInfo.cur_price * pos.shares - pos.totCost;
      this.TotCost += pos.totCost;
      this.doughnutChartData[0].push(pos.shares * pos.latestInfo.cur_price);
      this.doughnutBackgroundColors[0].backgroundColor.push(this.getRandomColor());
      this.doughnutChartLabels.push(pos.symbol);
    });
    this.rowData = this.positions;
    const date = new Date();
    this.lineChartData[1].data.push(this.MktTotl + this.portfolio.cashbalance + (this.DLTot * -1) );
    this.lineChartData[0].data.push(this.MktTotl + this.portfolio.cashbalance  );
    this.lineChartLabels.push(new Date().getHours() + ':'
      + new Date().getMinutes() + ':' + new Date().getSeconds());

    // this.positions.sort((a, b) => (a.shares * a.latestInfo.change) - (b.shares * b.latestInfo.change));
  }
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 4; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    color = '#00' + color;
    return color;
  }
  updatePortfolio(eData) {
    console.log(eData);
    this.portfolioSrv.AddTransaction(this.pid, this.portfolio, eData).subscribe(d => {
      this.portfolio = d;
      this.positions = this.portfolioSrv.getCurrentPositions(d);
      this.stockService.loadStocks(this.positions.map(ele => ele.symbol));
    });
  }
}
