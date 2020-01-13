import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './portfolio-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ServicesModule } from './services/services.module';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { RealtimeComponent } from './watchlist/realtime.component';
import { HttpClientModule } from '@angular/common/http';
import { AddTransactionComponent } from './watchlist/add-transaction.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,
    WatchlistComponent,
    RealtimeComponent,
    AddTransactionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    NgxChartsModule,
    ServicesModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
