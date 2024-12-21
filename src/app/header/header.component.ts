import { Component } from '@angular/core';
import { BinanceApiService } from '../binance.api.service';
import Swal from 'sweetalert2';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isHedgeMode: boolean = false;

  constructor(private binanceApiService: BinanceApiService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.binanceApiService.getHedgeModeStatus().subscribe(data => {
      this.isHedgeMode = data.dualSidePosition;
      this.sharedService.updateData(data);
    },
    error => {
      this.showCustomAlert('There was an error getting position mode: ' + error.msg, false)
    });
  }

  onToggleChange(event: any): void {
    const isChecked = event.target.checked;
    console.log('Toggle Switch State:', isChecked);
    this.binanceApiService.enableHedgeMode(isChecked).subscribe(
      response => {
        console.log("Mode changed successfully", response);
        this.sharedService.updateData({dualSidePosition : isChecked});
        this.showCustomAlert((isChecked) ? 'Hedge mode enabled' : 'Hedge mode disabled', true);
        // Handle the success response here, maybe navigate or show a success message
      },
      error => {
        event.target.checked = !isChecked;
        console.error('There was an error during mode change:', error.msg);
        this.showCustomAlert('There was an error during mode change: ' + error.msg, false)
        // Handle the error response here
      }
    );
  }

  showCustomAlert(message: string, status: boolean) {
    Swal.fire({
      title: status ? 'Success' : 'Error',
      text: message,
      icon: status ? 'success' : 'error',
      confirmButtonText: 'OK'
    });
  }
}
