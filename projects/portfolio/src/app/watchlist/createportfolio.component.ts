import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PortfolioService } from '../services/portfolio.service';
import { AuthService } from '../services/auth.service';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-createportfolio',
  templateUrl: './createportfolio.component.html',
  styles: []
})
export class CreateportfolioComponent implements OnInit {

  constructor(private http: HttpClient, private pSrv: PortfolioService, private authService: AuthService) { }
  CurrentStatus = '';
  portfolios: any[] = null;
  ngOnInit() {
    const usrInfo = this.authService.getUserInfo();

    this.pSrv.getPortfolioUrl(usrInfo.email).subscribe(data => {
      console.log(data); // load portfolio from data.url
    }, err => {
       this.pSrv.InitUser(usrInfo.email).subscribe(data => {
        console.log(data.uri); // created portfolio list bin , update user mapping
        this.pSrv.AddUserMapping(usrInfo.email, data.uri).subscribe(addUsrMapData => { console.log(addUsrMapData); });
      });
    }
    );

    // const usrCid = JSON.parse(localStorage.getItem('usercid'));
    // if (usrCid && usrCid.uid && usrCid.uid === usrInfo.email && usrCid.cid) {
    //   this.CurrentStatus = usrCid.cid;
    //   this.GetAllPortfolios(usrCid.cid);
    // } else {
    //   this.pSrv.getUserCollectionId(usrInfo.email).subscribe(data => {
    //     this.CurrentStatus = data.cid;
    //     localStorage.setItem('usercid', JSON.stringify(data));
    //     this.GetAllPortfolios(data.cid);
    //   }, err => {
    //     if (err.status === 404) {
    //       this.CreateNewCollection(usrInfo.email);
    //     }
    //   });
    // }
  }
  // CreateNewCollection(email: string) {
  //   this.pSrv.CreateNewCollection(email).subscribe(data => {
  //     if (data.success) {
  //       this.pSrv.addUserToCollection(email, data.id).subscribe(data => {
  //         this.CurrentStatus = data.id;
  //       });
  //     }
  //   });
  // }
  // GetAllPortfolios(cid: string) {
  //   this.pSrv.GetAllPortfolios(cid).subscribe(res => {
  //     this.portfolios = res.records;
  //   });
  // }
  // CreatePortfolio() {
  //   const usrCid = JSON.parse(localStorage.getItem('usercid'));
  //   this.pSrv.CreatePortfolio('test', usrCid.cid).subscribe(data => {
  //     console.log(data);
  //   });
  // }
}
