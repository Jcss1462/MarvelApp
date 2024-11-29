import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Comic } from '../Models/comic';
import { ComicDataWrapper } from '../Models/comicDataWrapper';

@Injectable({
  providedIn: 'root'
})
export class ComicService {

  private http = inject(HttpClient);

  constructor() { }

  getComicsList(currentPage:number,limit:number) {

    const url=new URL(environment.MarvelApi.url+"/comics");

    let params = new HttpParams()
      .set('ts', environment.MarvelApi.ts) 
      .set('apikey', environment.MarvelApi.apiKey)
      .set('hash', environment.MarvelApi.hash)
      .set('limit', limit)
      .set('orderBy', "issueNumber")
      .set('offset', (currentPage-1)*limit);

    let options={
      params:params
    }

    let response: Observable<ComicDataWrapper> = this.http.get<ComicDataWrapper>(url.toString(),options);
    return response;
  }
}
