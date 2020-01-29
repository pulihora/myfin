import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
import { WatchlistComponent } from './watchlist/watchlist.component'
import { CreateportfolioComponent } from './watchlist/createportfolio.component';
import { LoginPageComponent } from './login-page/login-page.component';
    const routes: Routes = [
        { path: '', component: LoginPageComponent },
        { path: 'login', component: LoginPageComponent },
        { path: 'dash', component: CreateportfolioComponent },
        { path: 'portfolio/:pid', component: WatchlistComponent},
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