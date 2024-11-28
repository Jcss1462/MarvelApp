import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword} from '@angular/fire/auth';
import { LogInUser, NewUser, UserData } from '../Models/user';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firebaseAuth = inject(Auth);
  private http = inject(HttpClient);

  constructor() { }

  async register(newUser: NewUser) {
    return createUserWithEmailAndPassword(this.firebaseAuth, newUser.email, newUser.password);
  }

  registerBackend(newUser: NewUser) {
    const url=environment.MarvelAppBack+"/Usuario/Register";
    return  this.http.post<void>(url, newUser);
  }

  async login(user: LogInUser){
    return await signInWithEmailAndPassword(this.firebaseAuth, user.email, user.uid);
  }

  loginBackend(user: LogInUser) {
    const url=environment.MarvelAppBack+"/Usuario/Login";
    return  this.http.post<UserData>(url, user);
  }

  async resetPassword(email: string){
    return sendPasswordResetEmail(this.firebaseAuth, email);
  }


}
