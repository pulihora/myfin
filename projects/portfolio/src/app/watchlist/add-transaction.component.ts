import { Component,EventEmitter, OnInit, Input, Output  } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {NgForm} from '@angular/forms';
import { PortfolioService } from '../services/portfolio.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styles: []
})
export class AddTransactionComponent implements OnInit {

  symbol: string;
  quantity: number;
  price: number;
  tDate: string;
  transType: string;
  @Output() portfolioUpdated = new EventEmitter();
  @Input() pid: string;
  constructor(private portfolioSrv: PortfolioService) { }

  ngOnInit() {
  }
AddTrans(){
  let trans: Transaction = {
      id:'txx',
      date: new Date(this.tDate),
  symbol: this.symbol,
  quantity: this.quantity,
  price: this.price,
  transType: this.transType,
  };  
  this.portfolioUpdated.emit(this.portfolioSrv.AddTransaction(this.pid,trans));  
}
}
