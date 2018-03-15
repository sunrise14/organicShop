import { Product } from './models/product';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take'; 
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { ShoppingCart } from './models/shopping-cart';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  private create() { 
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  async getCart():Promise<Observable<ShoppingCart>>{
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId).snapshotChanges().map(action=>{
    const key = action.key;
     const items = action.payload.val().items;
     return new ShoppingCart(key, items);
    });
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string> { 
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId; 

    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  async addToCart(product: Product) { 
    let cartId = await this.getOrCreateCartId();
    this.updateItemQuantity(product, 1);
  }

  async removeFromCart(product: Product) {
    let cartId = await this.getOrCreateCartId();
    this.updateItemQuantity(product, -1);
  }

  private async updateItemQuantity(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
   // console.log("I am here");
    let item$ = this.getItem(cartId, product.$key);
    //console.log("I am here");
    item$.snapshotChanges().take(1).subscribe(item => {
      if (item.payload.exists()) {
        item$.update({quantity: item.payload.val().quantity + change});
      } else {
        item$.set({product: {
          title: product.title,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl,
        }, quantity: 1} );
      }

    });
  }
} 