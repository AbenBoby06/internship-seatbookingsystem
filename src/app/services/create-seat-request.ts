import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateSeatRequest } from '../interface/create-seat-request';

@Injectable({
  providedIn: 'root',
})
export class CreateSeatRequestService {
  private apiURL = 'http://localhost:5035/api/seat'

  constructor(private http:HttpClient){}

  createSeats(request:CreateSeatRequest):Observable<any>{
    return this.http.post(this.apiURL,request);
  }

}
