import { Component, OnInit } from '@angular/core';
import { PortfolioService } from './services/portfolio.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'portfolio';
  isAuthenticated = false;
  FullName = '';
  constructor(private portfolioSrv: PortfolioService, private authService:AuthService,
    private router:Router) {
  }
  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if(this.isAuthenticated)
    {
      this.FullName = this.authService.getUserInfo();
    }
  }
  logOut(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
