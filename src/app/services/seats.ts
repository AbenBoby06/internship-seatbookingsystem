import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seats } from '../interface/seats';
import { CreateSeatRequest } from '../interface/create-seat-request';

@Injectable({
  providedIn: 'root',
})
export class SeatsService {
  private apiURL = 'http://localhost:5035/api/seat';

  constructor(private http:HttpClient){}

  getSeats():Observable<Seats[]>{
    return this.http.get<Seats[]>(this.apiURL);
  }

  addSeats(seats:Seats):Observable<Seats>{
    return this.http.post<Seats>(this.apiURL,seats);
  }

  assignseat(request: CreateSeatRequest):Observable<Seats>{
    return this.http.put<Seats>(
      `${this.apiURL}/Assignseats`,request
    );
  }

  unassignseat(request: CreateSeatRequest):Observable<Seats>{
    return this.http.put<Seats>(
      `${this.apiURL}/Unassignseats`,request
    );
  }

  deleteSeats(id:number):Observable<any>{
    return this.http.delete(
      `${this.apiURL}/${id}`
    );
  }
}
