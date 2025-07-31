import type { Route } from "@angular/router";
import { ProductsComponent } from "./products/products.component";
import { ProductsGridComponent } from "./products-grid/products-grid.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { AddProductsComponent } from "./add-products/add-products.component";
import { CategoriesComponent } from "./categories/categories.component";
import { OrdersComponent } from "./orders/orders.component";
import { OrderDetailsComponent } from "./order-details/order-details.component";
import { CustomersComponent } from "./customers/customers.component";
import { SellersComponent } from "./sellers/sellers.component";

export const ECOMMERCE_ROUTES: Route[] = [
  {
    path: 'products',
    component: ProductsComponent,
    data: { title: 'Products' }
  },
  {
    path: 'products-grid',
    component: ProductsGridComponent,
    data: { title: 'Products Grid' }
  },
  {
    path: 'product-details',
    component: ProductDetailsComponent,
    data: { title: 'Product Details' }
  },
  {
    path: 'add-products',
    component: AddProductsComponent,
    data: { title: 'Add Products' }
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    data: { title: 'Categories' }
  },
  {
    path: 'orders',
    component: OrdersComponent,
    data: { title: 'Orders' }
  },
  {
    path: 'order-details',
    component: OrderDetailsComponent,
    data: { title: 'Order Details' }
  },
  {
    path: 'customers',
    component: CustomersComponent,
    data: { title: 'Customers' }
  },
  {
    path: 'sellers',
    component: SellersComponent,
    data: { title: 'Sellers' }
  },
]