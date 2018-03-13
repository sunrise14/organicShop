import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../product.service';
import { Observable } from '@firebase/util/dist/esm/src/subscribe';
import { Subscribable } from 'rxjs/Observable';
import { Product } from '../../models/product';
import { DataTableResource } from 'angular5-data-table';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products:Product[];
  filteredProducts:any[];
  subscription:Subscription;
  tableResource:DataTableResource<Product>;
  items:Product[]=[];
  itemCount:number;

  constructor(private productSevice: ProductService) {
    this.subscription = this.productSevice.getAll()
      .subscribe(products => {
      this.products = products;
      this.initializeTable(products);
      });
    }
  
  private initializeTable(products:Product[]){
      this.tableResource = new DataTableResource(products);
      this.tableResource.query({offset:0})
      .then(items => this.items = items);
      this.tableResource.count()
      .then(count=>this.itemCount = count);
  }

  reloadItems(params){
    if(!this.tableResource) return;
    this.tableResource.query(params)
    .then(items=>this.items=items);
  }

  filter(query:string){
    let filteredProducts = (query) ?
    this.products.filter(p=>p.title.toLowerCase().includes(query.toLowerCase())):
    this.products;
    this.initializeTable(filteredProducts);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  ngOnInit() {
  }
}