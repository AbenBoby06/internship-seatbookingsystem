import { Departments } from "./departments";

export interface Project {
    projId:number,
    projName:string,
    deptId: number,
    department: Departments
}
