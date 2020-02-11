import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angular-6-social-login';

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
import { CreateportfolioComponent } from './watchlist/createportfolio.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthAPIService } from './services/auth-api.service';
import { UserService } from './services/user.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HeaderComponent } from './components/header/header.component';

export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('419411609008-s4boe6gbb3v00medor45fg9vunf2licp.apps.googleusercontent.com')
      }
    ]
  );
  return config;
}
@NgModule({
  declarations: [
    AppComponent,
    WatchlistComponent,
    RealtimeComponent,
    AddTransactionComponent,
    CreateportfolioComponent,
    LoginPageComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    NgxChartsModule,
    AgGridModule.withComponents([]),
    ServicesModule.forRoot()
  ],
  providers: [AuthAPIService, UserService, AuthGuardService, AuthService,JwtHelperService, {
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
