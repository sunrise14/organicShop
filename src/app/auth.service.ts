import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import * as firebase from 'firebase';
import {UserService} from './user.service';
import {AppUser} from './models/app-user';
import 'rxjs/add/operator/switchMap';


@Injectable()
export class AuthService {
  user$: Observable<firebase.User>;
  
  constructor(
    private userService:UserService,
    private afAuth:AngularFireAuth,
    private route:ActivatedRoute){
    this.user$ = afAuth.authState;
  }
  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }
  logout(){
    this.afAuth.auth.signOut();
  }

  get appUser$():Observable<AppUser>{
    return this.user$
    .switchMap(user => user?this.userService.get(user.uid).valueChanges():Observable.of<AppUser>(null));

  }
}
