import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PortfolioService } from '../services/portfolio.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-createportfolio',
  templateUrl: './createportfolio.component.html',
  styles: []
})
export class CreateportfolioComponent implements OnInit {

  constructor(private http: HttpClient, private pSrv: PortfolioService, private authService:AuthService) { }

  ngOnInit() {
    // this.authService.getUserInfo
  }

  CreatePortfolio() {
    this.pSrv.CreatePortfolio('test').subscribe(data => {
      console.log(data);
    });
  }
}
