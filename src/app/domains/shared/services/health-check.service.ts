import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {

  private http = inject(HttpClient);

  constructor() { }

  checkMarvelAppBackHealth() {
    const url=new URL(environment.MarvelAppBack+"/Health/health");
    const options={responseType: 'text' as 'json'};
    return this.http.get<string>(url.toString(),options); 
  }
}
