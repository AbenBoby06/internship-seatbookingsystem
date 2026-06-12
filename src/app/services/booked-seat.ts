import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
//import { Seats } from '../interface/seats'
//import { Employee } from '../interface/employee'
import { BookedSeat } from '../interface/booked-seat'

@Injectable({
  providedIn: 'root',
})
export class BookedSeatService {
  private apiURL = 'http://localhost:5035/api/bookedseat'

  constructor(private http:HttpClient){}

  getBookedSeat():Observable<BookedSeat[]>{
    return this.http.get<BookedSeat[]>(this.apiURL);
  }

  addBookedSeat(bookedseat:BookedSeat):Observable<BookedSeat>{
    return this.http.post<BookedSeat>(this.apiURL,bookedseat);
  }

  updateBookedSeat(bookedseat:BookedSeat):Observable<BookedSeat>{
    return this.http.put<BookedSeat>(
      `${this.apiURL}/${bookedseat.id}`,bookedseat
    );
  }

  deleteBookedSeat(id:number):Observable<any>{
    return this.http.delete(
      `${this.apiURL}/${id}`
    );
  }
}
