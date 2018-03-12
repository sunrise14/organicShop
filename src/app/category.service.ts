import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CategoryService {
  

  constructor(private db:AngularFireDatabase) { 
   
  }
  
  getCategories(){
    return this.db.list('/categories', ref=>ref.orderByChild('name')).snapshotChanges();
}
}
