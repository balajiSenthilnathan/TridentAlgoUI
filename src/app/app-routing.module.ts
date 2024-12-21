import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlaceOrderComponent } from './place-order/place-order.component'; 


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'placeOrder', component: PlaceOrderComponent } 
  // Add more routes here as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
