import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase';
import { FirebaseApp } from '@firebase/app-types';
import { AppUser } from './models/app-user';
import { AngularFireObject } from 'angularfire2/database/interfaces';

@Injectable()
export class UserService {  

  constructor(private db:AngularFireDatabase) { }
  save(user:firebase.User){
    this.db.object('/users/'+ user.uid).update({//everytime user logsin we update their name.
      name:user.displayName,
      email:user.email
    });
  }
  get(uid: string): AngularFireObject<AppUser>{
    return this.db.object('/users/'+uid);
  }
}
