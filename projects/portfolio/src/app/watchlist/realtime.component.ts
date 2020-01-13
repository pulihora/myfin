import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styles: []
})
export class RealtimeComponent implements OnInit {
  @Input() stock: Stock;
  @Input() position: StockPosition;
  constructor() { }

  ngOnInit() {
  }
}
