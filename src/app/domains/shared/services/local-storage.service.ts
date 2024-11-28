import { Injectable, signal } from '@angular/core';

import { UserData } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {


  userData = signal<UserData|null>(null);
  constructor() {
    this.setSignalByLocalStorage();
  }

  setUserDataLocalStorage(data:UserData){
    //elimino la informacion del local storage
    this.removeUserDataLocalStorage();        
    //guardo la informacion en el localstorage
    const dataString = JSON.stringify(data);
    localStorage.setItem('MarevelAppUserData', dataString);
    this.userData.set(data);
  }

  removeUserDataLocalStorage(){
    localStorage.removeItem("MarevelAppUserData");
    this.userData.set(null);
  }

  setSignalByLocalStorage(){
    const item = localStorage.getItem("MarevelAppUserData");
    if (item !== null) {
      let userDataJson=JSON.parse(item);
      this.userData.set(userDataJson);
    }
  }



}
