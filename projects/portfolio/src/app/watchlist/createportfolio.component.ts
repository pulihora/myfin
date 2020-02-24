import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PortfolioService } from '../services/portfolio.service';
import { AuthService } from '../services/auth.service';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-createportfolio',
  templateUrl: './createportfolio.component.html',
  styleUrls: ['./createportfolio.component.css']
})
export class CreateportfolioComponent implements OnInit {

  constructor(private http: HttpClient, private pSrv: PortfolioService, private authService: AuthService) { }
  CurrentStatus = '';
  portfolios: any[] = null;
  enableAdd = false;
  portfolioUrl = '';
  portfolioName = '';
  statusText = '';
  ngOnInit() {
    const usrInfo = this.authService.getUserInfo();
    this.statusText = 'Getting portfolio url';
    this.pSrv.getPortfolioUrl(usrInfo.email).subscribe(data => {
      this.statusText = 'Loading portfolio data';
      this.portfolioUrl = data.portfolio_url;
      console.log(data); // load portfolio from data.uri
      this.LoadPortfolios(data.portfolio_url);
    }, err => {
      this.pSrv.InitUser(usrInfo.email).subscribe(initData => {
        this.portfolioUrl = initData.uri;
        console.log(initData.uri); // created portfolio list bin , update user mapping
        this.pSrv.AddUserMapping(usrInfo.email, initData.uri).subscribe(addUsrMapData => {
          console.log(addUsrMapData);
          this.LoadPortfolios(initData.uri);
        });
      });
    }
    );
  }
  LoadPortfolios(portfolioUri: string) {
    this.pSrv.LoadPortfolios(portfolioUri).subscribe(pData => {
      this.enableAdd = true;
      this.portfolios = pData.portfolios;
      console.log(pData);
    });
  }
  CreatePortfolio() {
    const usrInfo = this.authService.getUserInfo();
    this.pSrv.CreatePortfolio(this.portfolioName, usrInfo.email).subscribe(data => {
      // save to portfolioUrl
      this.pSrv.LoadPortfolios(this.portfolioUrl).subscribe(pData => {
        pData.portfolios.push( { name: this.portfolioName, pUrl: data.uri});
        console.log(pData);
        this.pSrv.UpdateProfile(pData, this.portfolioUrl).subscribe(profileData => { console.log(profileData); });
      });
    });
   }
}
