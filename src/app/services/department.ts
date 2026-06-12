import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departments } from '../interface/departments';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiURL = 'http://localhost:5035/api/department'

  constructor(private http: HttpClient){}

  getDepartment():Observable<Departments[]>{
    return this.http.get<Departments[]>(this.apiURL);
  }
}
