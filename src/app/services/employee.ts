import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Employee } from '../interface/employee'

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiURL = 'http://localhost:5035/api/employee'

  constructor(private http:HttpClient){}

  getEmployee():Observable<Employee[]>{
    return this.http.get<Employee[]>(this.apiURL);
  }

  addEmployee(employee:Employee):Observable<Employee>{
    return this.http.post<Employee>(this.apiURL,employee);
  }

  updateEmployee(employee:Employee):Observable<Employee>{
    return this.http.put<Employee>(
      `${this.apiURL}/${employee.empId}`,employee
    );
  }

  deleteEmployee(id:number):Observable<any>{
    return this.http.delete(
      `${this.apiURL}/${id}`
    );
  }
}
