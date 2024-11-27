import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { NewUser } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firebaseAuth = inject(Auth);

  constructor() { }

  async register(newUser: NewUser) {

    return createUserWithEmailAndPassword(this.firebaseAuth, newUser.email, newUser.password);

  }
}
