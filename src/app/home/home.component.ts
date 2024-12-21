import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BinanceApiResponse } from '../model/binance.api.response.model';
import { BinanceApiService } from '../binance.api.service';
import Swal from 'sweetalert2';
import { ServerSentEventsService } from '../server.sent.events.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  openOrders: BinanceApiResponse[] = [];
  selectedOrderIds: number[] = [];
  symbols: string[] = ['XRPUSDT', 'BTCUSDT', 'ETHUSDT']; // List of symbols
  selectedSymbol: string = "XRPUSDT";
  isLoading = false;
  isHedgeMode = false;
  isBothSides = false;
  @ViewChild('orderForm') orderForm!: NgForm;

  constructor(private binanceApiService: BinanceApiService,
    private serverSentEventsService: ServerSentEventsService,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.sharedService.data$.subscribe((data) => {
      console.log(data);
      this.isHedgeMode = data.dualSidePosition;
    });

    this.getAllOpenOrders();
    this.serverSentEventsService.listenToServerEvents().subscribe(
      (event: MessageEvent) => {
        console.log('Received message:', event.data);  // Handle the incoming message
        //this.message = event.data;  // Display the event data in the component
        this.binanceApiService.getOpenOrders(this.selectedSymbol).subscribe(data => {
          this.sort(data);
          this.toastr.success('Success!', event.data);
          this.cdr.detectChanges();  // Explicitly trigger change detection
        });
      },
      (error) => console.error('Error listening to events:', error)
    );
  }
  getAllOpenOrders() {
    this.binanceApiService.getOpenOrders(this.selectedSymbol).subscribe(data => {
      //this.openOrders = data;
      this.sort(data);
    });
  }

  onCheckboxChange(event: any, orderId: number): void {
    if (event.target.checked) {
      this.selectedOrderIds.push(orderId);
    } else {
      const index = this.selectedOrderIds.indexOf(orderId);
      if (index > -1) {
        this.selectedOrderIds.splice(index, 1);
      }
    }
  }

  onSymbolChange(event: any): void {
    console.log('Selected Symbol:', event.target.value);
    this.selectedSymbol = event.target.value;
    // Filter or fetch orders based on selected symbol if needed
  }

  deleteSelectedOrders(): void {
    const orderData = {
      symbol: this.selectedSymbol,
      orderIds: this.selectedOrderIds
    };
    console.log('Selected Order IDs:', this.selectedOrderIds);
    this.binanceApiService.deleteOrderIds(orderData).subscribe(
      response => {
        console.log('Orders deleted successfully:', response);
        this.getAllOpenOrders();
        this.showCustomAlert('Orders deleted successfully', true);
        // Handle success response here
      },
      error => {
        console.error('Error deleting orders:', error.msg);
        this.showCustomAlert('Error deleting orders : ' + error.msg, false);
        // Handle error response here
      }
    );
  }

  deleteAllOpenOrders(): void {
    console.log('Another action triggered');
    this.binanceApiService.deleteAllOpenOrders(this.selectedSymbol).subscribe(
      response => {
        console.log('All Orders deleted successfully:', response);
        this.getAllOpenOrders();
        this.showCustomAlert('All Orders deleted successfully', true);
        // Handle success response here
      },
      error => {
        console.error('Error deleting orders:', error.msg);
        this.showCustomAlert('Error deleting orders : ' + error.msg, false);
        // Handle error response here
      }
    );
  }

  prepareBinanceRequestData(orderForm: any) {
    const { value } = orderForm; 
    const {
      symbol,
      side,
      type,
      quantity,
      timeInForce,
      price,
      step,
      quantityType,
      buySpreadPercent,
      sellSpreadPercent,
      spreadPercent
    } = value;
  
    const createOrder = (side: string, positionSide: string | null, spreadPercent: number) => ({
      symbol,
      side,
      type,
      quantity,
      timeInForce,
      positionSide,
      price,
      modifiers: {
        spreadPercent,
        step,
        quantityType,
        isHedgeMode: this.isHedgeMode
      }
    });
  
    if (side === 'BOTH') {
      return [
        createOrder('BUY', this.isHedgeMode ? 'LONG' : null, buySpreadPercent),
        createOrder('SELL', this.isHedgeMode ? 'SHORT' : null, sellSpreadPercent)
      ];
    }
  
    const positionSide =
      this.isHedgeMode && side === 'BUY'
        ? 'LONG'
        : this.isHedgeMode && side === 'SELL'
        ? 'SHORT'
        : null;
  
    return [createOrder(side, positionSide, spreadPercent)];
  }
  

  onSubmit(orderForm: any): void {
    this.isLoading = true;
    const orderData = this.prepareBinanceRequestData(orderForm);

    console.log(orderData);
    // Call the service to send data to the backend
    this.binanceApiService.placeOrder(orderData).subscribe(
      response => {
        console.log('Order placed successfully:', response);
        this.isLoading = false;
        this.getAllOpenOrders();
        this.showCustomAlert('Orders placed successfully', true);
        // Handle the success response here, maybe navigate or show a success message
      },
      error => {
        console.error('There was an error placing the order:', error.msg);
        this.isLoading = false;
        this.showCustomAlert('There was an error placing the order: ' + error.msg, false)
        // Handle the error response here
      }
    );
  }

  clearForm(orderForm: any): void {
    orderForm.resetForm();  // Resets the form fields and their validity
  }

  getMarketPriceBySymbol(event: any): void {
    this.isLoading = true;
    const inputValue = event.target.value;
    console.log('Input lost focus. Value:', inputValue);
    this.binanceApiService.getMarketPriceBySymbol(inputValue).subscribe(
      response => {
        this.isLoading = false;
        this.orderForm.controls['price'].setValue(response.price);
        // Handle the success response here, maybe navigate or show a success message
      },
      error => {
        console.log('There was an error while getting market price: ' + error.msg);
        this.isLoading = false;
        this.showCustomAlert('There was an error while getting market price: ' + error.msg, false)
        // Handle the error response here
      }
    );
    // Add your custom logic here
  }

  triggerSideChangeAction(orderForm: any) {
    if ("BOTH" === orderForm.value.side) {
      this.isBothSides = true;
    } else {
      this.isBothSides = false;
    }
  }

  showCustomAlert(message: string, status: boolean) {
    Swal.fire({
      title: status ? 'Success' : 'Error',
      text: message,
      icon: status ? 'success' : 'error',
      confirmButtonText: 'OK'
    });
  }

  sort(data: any[]) {
    this.openOrders = data.sort((a, b) => {
      if (a.positionSide === b.positionSide) {
        return b.price - a.price; // Descending order for price
      }
      return a.positionSide.localeCompare(b.positionSide); // Ascending order for positionSide
    });
  }
}
