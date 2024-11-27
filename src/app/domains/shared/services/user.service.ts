import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { logInUser, NewUser } from '../Models/user';
import { signInWithEmailAndPassword } from 'firebase/auth';

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
}
