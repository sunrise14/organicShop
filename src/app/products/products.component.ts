import { Subscription } from 'rxjs/Subscription';
import { ShoppingCartService } from './../shopping-cart.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../models/product';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent  implements OnInit, OnDestroy{
products:Product[] =[];
filteredProducts:Product[]=[];
//cart: any;
subscription:Subscription;
cart$:Observable<ShoppingCart>;

category:string;
  constructor(
    private route:ActivatedRoute,
    private productService:ProductService,
    private shoppingCartService:ShoppingCartService){
    
    productService.getAll().switchMap(products => {
      this.products=products;
      return route.queryParamMap;
    })
    .subscribe(params =>{
      this.category = params.get('category');
      this.filteredProducts = (this.category)?
      this.products.filter(p=>p.category === this.category):
      this.products;
    });
   
  }
    async ngOnInit() {
     // this.subscription = (await this.shoppingCartService.getCart()).valueChanges()
      //.subscribe(cart => this.cart = cart);
      this.cart$ = await this.shoppingCartService.getCart();
    }
    ngOnDestroy() { 
     this.subscription.unsubscribe();
   }
}
