import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword} from '@angular/fire/auth';
import { logInUser, NewUser } from '../Models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firebaseAuth = inject(Auth);

  constructor() { }

  async register(newUser: NewUser) {
    return createUserWithEmailAndPassword(this.firebaseAuth, newUser.email, newUser.password);
  }

  async login(user: logInUser){
    return await signInWithEmailAndPassword(this.firebaseAuth, user.email, user.password);
  }

  async resetPassword(email: string){
    return sendPasswordResetEmail(this.firebaseAuth, email);
  }
}
