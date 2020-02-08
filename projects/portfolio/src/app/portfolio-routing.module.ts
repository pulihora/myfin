import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchlistComponent } from './watchlist/watchlist.component'
import { CreateportfolioComponent } from './watchlist/createportfolio.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'home', component: CreateportfolioComponent, canActivate: [AuthGuard] },
  { path: 'portfolio/:pid', component: WatchlistComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
