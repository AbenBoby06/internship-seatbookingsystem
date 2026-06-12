import { Departments } from "./departments";
import { Location } from "./location";

export interface Module {
    moduleId?:number,
    moduleName: string,
    floorNo: number,
    locId: number,
    location?: Location,
    deptId: number,
    department?:Departments,
    seatLimit?: number,
    seatsAssigned:number,
    seatsUnassigned:number
}
