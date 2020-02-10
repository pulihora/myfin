import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  FullName = '';
  constructor(private authService: AuthService, private router: Router) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.renderHeader();
      }
    });
   }

  ngOnInit() {
    this.renderHeader();
  }
  private renderHeader() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.FullName = '';
      const userInfo = this.authService.getUserInfo();
      if (!(userInfo.given_name === undefined && userInfo.family_name === undefined)) {
        this.FullName = userInfo.given_name + ', ' + userInfo.family_name;
      }
    }
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
