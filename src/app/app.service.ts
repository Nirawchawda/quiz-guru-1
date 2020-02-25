import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
  	    private http: HttpClient
  ) { }
  
  getShippingPrices() {
    return this.http.get('/assets/Data.json');
  }
}
