import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BinanceApiResponse } from './model/binance.api.response.model';
import { BinanceOrderDeleteRequest } from './model/binance.order.delete.model';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BinanceApiService {

  private apiUrl = environment.apiUrl;
  //''; // URL of the Spring Boot endpoint
  //private apiUrl = 'https://4544-2406-7400-bb-6a9b-480a-f799-d505-cd5.ngrok-free.app/api/v1/rest'; // URL of the Spring Boot endpoint

  constructor(private http: HttpClient) { }

  getOpenOrders(symbol?: string): Observable<BinanceApiResponse[]> {
    let params = new HttpParams();
    if (symbol) {
      params = params.set('symbol', symbol);
    }
    return this.http.get<BinanceApiResponse[]>(this.apiUrl + "/openOrders", { params }).pipe(
      catchError(this.handleError)
    );
  }

  // POST method to send order data to the backend
  placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/placeOrder", orderData).pipe(
      catchError(this.handleError)
    );
  }

  deleteOrderIds(orderData: BinanceOrderDeleteRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orderList`, orderData).pipe(
      catchError(this.handleError)
    );
  }

  deleteAllOpenOrders(symbol: string): Observable<any> {
    let params = new HttpParams();
    if (symbol) {
      params = params.set('symbol', symbol);
    }
    return this.http.delete<any>(`${this.apiUrl}/allOpenOrders`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  enableHedgeMode(enableFlag: boolean): Observable<any> {
    let params = new HttpParams();
    params = params.set('enableFlag', enableFlag);
    return this.http.get<any>(this.apiUrl + "/enableHedgeMode", { params }).pipe(
      catchError(this.handleError)
    );
  }

  getMarketPriceBySymbol(symbol: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('symbol', symbol);
    return this.http.get<any>(this.apiUrl + "/getMarketPrice", { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getHedgeModeStatus(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "/positionMode").pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Customize the error handling logic as needed
    
    let errorMessage = 'An unknown error occurred!';
    let jsonString = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      // Extract the JSON part using a regular expression
      if(error.error.text !== undefined)
        jsonString = error.error.text.match(/{.*}/)?.[0];
      else
        jsonString = error.error.error.message.match(/{.*}/)?.[0];
    
      // Convert the JSON string to an object if it's valid
      let errorObject: any = null;
      if (jsonString) {
        try {
          errorObject = JSON.parse(jsonString);
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      }
      errorMessage = errorObject;
    }
    // Log the error to the console or a remote logging infrastructure
    //console.error(errorMessage);
    // Return an observable with a user-facing error message
    return throwError(errorMessage);
  }


}
