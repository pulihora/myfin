import { Component, OnInit } from '@angular/core';
import {
  AuthService as SocialAuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';
import { AuthAPIService } from '../services/auth-api.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  public responseData: any;
  public userPostData = {
    email: '',
    name: '',
    provider: '',
    provider_id: '',
    provider_pic: '',
    token: '',
    idToken: ''
  };

  constructor(private socialAuthService: SocialAuthService,
    private authService: AuthService,
    public authAPIService: AuthAPIService,
    public user: UserService,
    private router:Router
    ) {
    this.user.sessionIn();
  }

  ngOnInit() { }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
      this.apiConnection(userData);
    });
  }

  apiConnection(data) {
    this.authService.setToken(data.idToken);
    this.router.navigate(['/home']);
  }
}