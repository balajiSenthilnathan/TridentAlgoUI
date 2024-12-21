import { Component } from '@angular/core';
import { BinanceApiService } from '../binance.api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent {

  isLoading = false;

  constructor(private binanceApiService: BinanceApiService) { }

  onSubmit(orderForm: any): void {
    this.isLoading = true;
    const orderData = {
      symbol: orderForm.value.symbol,
      side: orderForm.value.side,
      type: orderForm.value.type,
      quantity: orderForm.value.quantity,
      timeInForce: orderForm.value.timeInForce,
      positionSide: orderForm.value.positionSide,
      price: orderForm.value.price,
      modifiers: {
        spreadPercent: orderForm.value.spreadPercent,
        step: orderForm.value.step
      }
    };
    console.log(orderData);
    // Call the service to send data to the backend
    this.binanceApiService.placeOrder(orderData).subscribe(
      response => {
        console.log('Order placed successfully:', response);
        this.isLoading = false;
        this.showCustomAlert('Orders placed successfully', true)
        // Handle the success response here, maybe navigate or show a success message
      },
      error => {
        console.error('There was an error placing the order:', error);
        this.isLoading = false;
        this.showCustomAlert('There was an error placing the order: '+ error, true)
        // Handle the error response here
      }
    );
  }

  showCustomAlert(message: string, status: boolean) {
    Swal.fire({
      title: 'Success',
      text: message,
      icon: status ? 'success' : 'error',
      confirmButtonText: 'OK'
    });
}

  

}
