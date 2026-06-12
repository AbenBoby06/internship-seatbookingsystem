import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from '../interface/location';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiURL = 'http://localhost:5035/api/location'

  constructor(private http:HttpClient){}

  getLocation():Observable<Location[]>{
    return this.http.get<Location[]>(this.apiURL);
  }

  addLocation(location:Location):Observable<Location>{
    return this.http.post<Location>(this.apiURL,location);
  }

  updateLocation(location:Location):Observable<Location>{
    return this.http.put<Location>(
      `${this.apiURL}/${location.locId}`,location
    );
  }

  deleteLocation(id:number):Observable<any>{
    return this.http.delete(
      `${this.apiURL}/${id}`
    );
  }
}
