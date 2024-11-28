import { Injectable, signal } from '@angular/core';

import { UserData } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {


  userData = signal<UserData|null>(null);
  constructor() { }

}
