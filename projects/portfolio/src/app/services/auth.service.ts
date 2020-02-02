import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { decode } from 'punycode';

export const TOKEN_NAME: string = 'jwt_token';

@Injectable()
export class AuthService {

  private url: string = 'api/auth';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getToken(): string {
    return localStorage.getItem(TOKEN_NAME);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
  }
  logout(): void {
    localStorage.removeItem(TOKEN_NAME);
  }
  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0); 
    date.setUTCSeconds(decoded.exp);
    return date;
  }
  public getUserInfo():any{
    const decoded = jwt_decode(this.getToken());
    return decoded;
  }
  public isAuthenticated(): boolean {
    // Check whether the id_token is expired or not
    console.log("isAuthenticated");
    return !this.isTokenExpired(this.getToken());
  }
  isTokenExpired(token?: string): boolean {
    if(!token) token = this.getToken();
    if(!token) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

//   login(user): Promise<string> {
//     return this.http
//       .post(`${this.url}/login`, JSON.stringify(user), { headers: this.headers })
//       .toPromise()
//       .then(res => res.text());
//   }

}