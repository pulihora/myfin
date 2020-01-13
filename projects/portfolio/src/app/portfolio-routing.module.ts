import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
import { WatchlistComponent } from './watchlist/watchlist.component'
    const routes: Routes = [
        { path: '', redirectTo: 'portfolio', pathMatch: 'full' },
        {
            path: 'portfolio/:pid',
            component: WatchlistComponent,
        },
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