import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { Module } from '../interface/module';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private apiURL = 'http://localhost:5035/api/module';

  constructor(private http:HttpClient){}

  getModule():Observable<Module[]>{
    return this.http.get<Module[]>(this.apiURL);
  }

  addModule(module:Module):Observable<Module>{
    return this.http.post<Module>(this.apiURL,module);
  }

  updateModule(module:Module):Observable<Module>{
    return this.http.put<Module>(
      `${this.apiURL}/${module.moduleId}`,module
    );
  }

  deleteModule(id:number):Observable<any>{
    return this.http.delete(
      `${this.apiURL}/${id}`
    );
  }
}
