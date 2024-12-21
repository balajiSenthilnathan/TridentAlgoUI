import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private dataSubject = new BehaviorSubject<{ dualSidePosition: boolean }>({ dualSidePosition: false });
  data$ = this.dataSubject.asObservable();
  
  constructor() { }

  updateData(data: { dualSidePosition: boolean }) {
    this.dataSubject.next({ ...data }); // Ensure a new reference is emitted
  }
  
}
