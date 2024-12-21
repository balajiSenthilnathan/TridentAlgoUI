import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerSentEventsService {

  private apiUrl = 'http://localhost:8080/api/v1/rest'; // URL of the Spring Boot endpoint

  constructor() { }

  listenToServerEvents(): Observable<MessageEvent> {
    return new Observable<MessageEvent>((observer) => {
      const eventSource = new EventSource(this.apiUrl + '/events');  // URL of your SSE endpoint

      eventSource.onmessage = (event) => {
        observer.next(event);  // Emits the message event to the Angular component
      };

      eventSource.onerror = (error) => {
        observer.error(error);  // Handles any errors
      };

      return () => eventSource.close();  // Cleanup when the Observable is unsubscribed
    });
  }
}
