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
  CurrentStatus = '';
  ngOnInit() {
    const usrInfo = this.authService.getUserInfo();
    const usrCid = JSON.parse(localStorage.getItem('usercid'));
    if(usrCid && usrCid.uid && usrCid.uid === usrInfo.email && usrCid.cid)
    {
      this.CurrentStatus = usrCid.cid;
      console.log('reading from ls');
      console.log(usrCid);
      // Get User portfolio using cid
    } else {
      this.pSrv.getUserCollectionId(usrInfo.email).subscribe(data => {
        console.log(data);    
        localStorage.setItem('usercid',JSON.stringify(data));
      }, err => {
        if(err.status === 404){
          //user not found create a collection and add it to user.
          this.CreateNewCollection(usrInfo.email);
        }
      });
    }
  }
  CreateNewCollection(email:string){
    this.pSrv.CreateNewCollection(email).subscribe(data => {
      if(data.success){
        this.pSrv.addUserToCollection(email,data.id).subscribe(data => { 
          this.CurrentStatus = data.id;
        });
      }
    });
  }
  
  CreatePortfolio() {
    this.pSrv.CreatePortfolio('test').subscribe(data => {
      console.log(data);
    });
  }
}
