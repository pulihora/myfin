import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient} from '@angular/common/http';
//const apiUrl = "https://apipaypal.9lessons.info/apipaypal/";
const apiUrl = "http://localhost/socialapi/";

@Injectable()
export class AuthAPIService {

constructor(public http: HttpClient) {
    console.log('Hello AuthService Provider');
}

   postData(credentials, type) {
       return new Promise((resolve, reject) => {
       const headers = new HttpHeaders();
       this.http.post(apiUrl + type, JSON.stringify(credentials), {headers: headers})
       .subscribe(res => {
            resolve(res);
        }, (err) => {
        reject(err);
    });

});

}
}