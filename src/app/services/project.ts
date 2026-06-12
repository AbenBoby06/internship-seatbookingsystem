import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../interface/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiURL = 'http://localhost:5035/api/project';

  constructor(private http:HttpClient){}

  getProject():Observable<Project[]>{
    return this.http.get<Project[]>(this.apiURL);
  }

  addProject(project:Project):Observable<Project>{
    return this.http.post<Project>(this.apiURL,project);
  }

  updateProject(project: Project):Observable<Project>{
    return this.http.put<Project>(
      `${this.apiURL}/${project.projId}`,project
    );
  }

  deleteProject(id:number):Observable<any>{
    return this.http.delete(
      `${this.apiURL}/${id}`
    );
  }
}
