import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from './portfolio.service';
import { StockService } from './stock.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: []
})
export class ServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [PortfolioService, StockService]
    }
  }
 }
