import { Component,OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location } from '../../interface/location';
import { Module } from '../../interface/module';
import { Project } from '../../interface/project';
import { CreateSeatRequest } from '../../interface/create-seat-request';
import { LocationService } from '../../services/location';
import { ProjectService } from '../../services/project';
import { ModuleService } from '../../services/module';
import { CreateSeatRequestService } from '../../services/create-seat-request';
import { CommonModule } from '@angular/common';
import { Seats } from '../../interface/seats';
import { SeatsService } from '../../services/seats';
import { Departments } from '../../interface/departments';
import { DepartmentService } from '../../services/department';
import { Projectcount } from '../../interface/projectcount';
import { Employee } from '../../interface/employee';
import { EmployeeService } from '../../services/employee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr',
  imports: [FormsModule, CommonModule],
  templateUrl: './hr.html',
  styleUrl: './hr.scss',
})
export class Hr implements OnInit{

  location: Location[] = [];
  module: Module[] = [];
  project: Project[] = [];
  department: Departments[] = [];
  seats: Seats[] = [];
  employee: Employee[] = [];
  projCountsMap: {[modId:number] : Projectcount[]} = {}

  projid: number = 0;
  modmodid: number = 0;
  seatmodid: number = 0;
  modlocid: number = 0;
  seatlocid: number = 0;
  projname: string = '';
  modlocname: string = '';
  seatlocname: string = ''
  modmodname: string = '';
  seatmodname: string = '';
  modfloor: number = 0;
  seatfloor: number = 0;
  expandedkey: string | null = null
  seatno: number = 0;
  moddept: string = '';
  moddeptid: number = 0;
  seatdept: string = '';
  seatdeptid: number = 0;
  assignedseats:number = 0;
  unassignedseats: number = 0;
  incount: number = 0;
  newcount: number = 0;
  empid: number = 0;
  empName: string = '';

  newRequest: CreateSeatRequest = {
    NoOfSeats:0,
    ModuleId : 0,
    ProjectID: 0
  }

  updatedModule: Module = {
    moduleId: 0,
    moduleName: '',
    floorNo: 0,
    locId: 0,
    deptId: 0,
    location:{
      locId:0,
      locName: ''
    },
    seatLimit:0,
    seatsAssigned:0,
    seatsUnassigned:0
  }

  updatedSeat: Seats = {
    seatId: 0,
    seatName: '',
    projId: 0,
    moduleId: 0,
    project:{
      projId:0,
      projName:'',
      deptId:0,
      department:{
        deptId:0,
        deptName:''
      }
    }
  }

  constructor(private locservice: LocationService,
              private projservice: ProjectService,
              private modservice: ModuleService,
              private createseatservice: CreateSeatRequestService,
              private deptservice: DepartmentService,
              private cdr: ChangeDetectorRef,
              private seatservice: SeatsService,
              private empservice: EmployeeService,
              private router: Router
  ){}

  ngOnInit():void{
    this.empid = Number(localStorage.getItem('empId'))
    this.loadDetails();
    this.cdr.detectChanges();
  }

  loadDetails(){
    this.empservice.getEmployee().subscribe(data=>{
      this.employee = data
      for(const emp of this.employee){
        if(emp.empId == this.empid){
          this.empName = emp.empName;
        }
      }
    })
    this.locservice.getLocation().subscribe(data=>{
      this.location = data;
      this.cdr.detectChanges();
    });
    this.projservice.getProject().subscribe(data =>{
      this.project = data;
      this.cdr.detectChanges();
    });
    this.modservice.getModule().subscribe(data =>{
      this.module = data;
      this.cdr.detectChanges();
    });
    this.deptservice.getDepartment().subscribe(data=>{
      this.department = data;
      this.cdr.detectChanges();
    })
    this.seatservice.getSeats().subscribe(data => {
      this.seats = data;
      this.cdr.detectChanges();
    })
  }

  getid(){
    for(const loc of this.location){
      if(loc.locName == this.modlocname){
        this.modlocid = loc.locId;
      }
    }

    for(const loc of this.location){
      if(loc.locName == this.seatlocname){
        this.seatlocid = loc.locId;
      }
    }

    for(const proj of this.project){
      if(proj.projName == this.projname){
        this.projid = proj.projId;
      }
    }

    for(const mod of this.module){
      if(this.modfloor == mod.floorNo &&
         this.modmodname == mod.moduleName &&
         this.modlocid == mod.locId){
        this.modmodid = mod.moduleId!;
      }
    }

    for(const mod of this.module){
      if(this.seatfloor == mod.floorNo &&
         this.seatmodname == mod.moduleName &&
         this.seatlocid == mod.locId){
        this.seatmodid = mod.moduleId!;
      }
    }

    for(const dept of this.department){
      if(this.moddept == dept.deptName){
        this.moddeptid = dept.deptId!;
      }
    }

    for(const dept of this.department){
      if(this.seatdept == dept.deptName){
        this.seatdeptid = dept.deptId!;
      }
    }
  }

  addseat(){
    this.getid();
    /*
    console.log(this.projid);
    console.log(this.modid);
    console.log(this.locid);
    console.log(this.floor);
    console.log(this.projname);
    console.log(this.modname);
    console.log(this.locname);
    */
   const currmodule = this.module.find(m=>m.moduleId === this.seatmodid)
   
   if(Number(this.seatno)<0){
      alert("Invalid number");
    }
   else if(this.seatno<=currmodule?.seatsUnassigned!){
      this.newRequest = {
        NoOfSeats: Number(this.seatno),
        ModuleId : this.seatmodid,
        ProjectID: this.projid
      }

    this.seatservice.assignseat(this.newRequest).subscribe(()=>{
      //count
      this.loadDetails();
      this.newRequest = {
        NoOfSeats: 0,
        ModuleId: 0,
        ProjectID:0
      }
      this.countseat(this.seatmodid);
      this.cdr.detectChanges();
    })
    if(this.seatlocid == currmodule?.locId && this.seatfloor == currmodule.floorNo && this.seatmodid == currmodule.moduleId && this.seatdeptid == currmodule.deptId){
    //console.log("currmodule: ",currmodule)
      this.updatedModule = {
        moduleId: currmodule?.moduleId,
        moduleName: currmodule?.moduleName!,
        floorNo: currmodule?.floorNo!,
        locId: currmodule?.locId!,
        deptId: this.seatdeptid,
        location: {
          locId: currmodule?.locId!,
          locName: currmodule?.location?.locName!
        },
        seatLimit: currmodule?.seatLimit,
        seatsAssigned: currmodule?.seatsAssigned! + Number(this.seatno),
        seatsUnassigned: currmodule?.seatsUnassigned! - Number(this.seatno)
      }
    }
    else{
      alert("Deatils dont match");
    }

      //console.log("updated module: ",this.updatedModule)
      //console.log("currmodule: ",currmodule)
    
    this.modservice.updateModule(this.updatedModule).subscribe({
      next: ()=>{
        this.seatservice.getSeats().subscribe({
          next: (freshseats) =>{
            this.seats = freshseats
            this.loadDetails();
            this.countseat(this.seatmodid);
            this.cdr.detectChanges();
          }
        })
    }})
    }
    else if(this.seatno>currmodule?.seatsUnassigned! ){
      alert("Exceeding the seat limit of module");
    }
  }

  assignModule(){
    this.getid();
    //console.log("locid: ",this.locid)
    //console.log("Locname: ",this.locname)
    const currmodule = this.module.find(m => m.moduleId === this.modmodid);
    //console.log(currmodule)
    //console.log("currmodule location:",currmodule?.location?.locName)

    this.updatedModule = {
      moduleId: this.modmodid,
      moduleName: this.modmodname,
      floorNo: this.modfloor,
      locId: this.modlocid,
      deptId: this.moddeptid,
      location: {
        locId: this.modlocid,
        locName: this.modlocname
      },
      seatsAssigned: currmodule?.seatsAssigned!,
      seatsUnassigned: currmodule?.seatsUnassigned!,
      seatLimit: currmodule?.seatLimit
    }
    this.modservice.updateModule(this.updatedModule).subscribe(()=>{
      this.loadDetails();
      this.updatedModule = {
        moduleId: 0,
        moduleName: '',
        floorNo: 0,
        locId: 0,
        deptId: 0,
        location: {
          locId: 0,
          locName: ''
        },
        seatsAssigned: 0,
        seatsUnassigned: 0
      }
      this.cdr.detectChanges();
    })
  }

  expand(modId: number, deptId: number){
    const currkey = `${deptId}-${modId}`
    if(this.expandedkey === currkey){
      this.expandedkey = null;
      this.cdr.detectChanges();
    }else{
    this.expandedkey = currkey
    }
    //console.log("expanded mod id",this.expandedkey);
    //console.log("mod id: ",modId)
    this.countseat(modId);
    this.cdr.detectChanges()
  }

  countseat(modId: number){
    let filteredSeat = this.seats.filter(s=>s.moduleId === modId)
    let currmod = this.module.find(m=>m.moduleId === modId) 

    this.projCountsMap[modId] = []
    for(let proj of this.project){
      let deptbool = false
      let count  = 0
      if(proj.deptId === currmod?.deptId){
        deptbool = true
      }
      for(let seat of filteredSeat){
        if(proj.projId == seat.projId){
          count++
        }
      }
      if(deptbool){
        const matchedDept = this.department.find(d => d.deptId === proj.deptId);
        const safeDeptName = matchedDept ? matchedDept.deptName : 'Unknown Department';
        this.projCountsMap[modId].push({
          projId: proj.projId,
          project: {
            projId:proj.projId,
            projName:proj.projName,
            deptId: proj.deptId,
            department:{
              deptId: proj.deptId,
              deptName: safeDeptName
            }
          },
          count: count,
          isEditing: false
        })
      }
      //console.log("dept name: ", proj.department.deptName)
    }
    
    //console.log(this.projcount);
  }

  seatedit(countarr: Projectcount){
    countarr.isEditing = true
    this.incount = countarr.count
    this.newcount = countarr.count
  }

  countchange(countarr: Projectcount, action: string){
    
    if(action == 'plus'){
      this.newcount++
    }
    else if(action == 'minus'){
      this.newcount--
    }
    countarr.count = this.newcount
  }

  updateseat(countarr: Projectcount,modid: number){
    countarr.isEditing = false
    const currmodule = this.module.find(m => m.moduleId === modid)
    let remseats = currmodule?.seatsAssigned! - this.incount
    let updateseatcount = 0
    //console.log("seats assigned: ", currmodule?.seatsAssigned)
    //console.log("initial count: ", this.incount)
    //console.log("remaining seats: ",remseats)
    //console.log(currmodule)
    if(this.newcount>this.incount){
      updateseatcount = this.newcount - this.incount
      this.newRequest = {
        NoOfSeats: updateseatcount,
        ModuleId : modid,
        ProjectID: countarr.projId
      }
      this.seatservice.assignseat(this.newRequest).subscribe({
        next: ()=>{
          this.loadDetails();
          this.cdr.detectChanges();
        }
      })
    }
    else if(this.newcount<this.incount){
      updateseatcount = this.incount - this.newcount
      this.newRequest = {
        NoOfSeats: updateseatcount,
        ModuleId : modid,
        ProjectID: countarr.projId
      }
      this.seatservice.unassignseat(this.newRequest).subscribe({
        next: ()=>{
          this.loadDetails();
          this.cdr.detectChanges();
        }
      })
    }
    
    this.updatedModule = {
    moduleId: modid,
    moduleName: currmodule?.moduleName!,
    floorNo: currmodule?.floorNo!,
    locId: currmodule?.locId!,
    deptId: currmodule?.deptId!,
    location:{
      locId:currmodule?.locId!,
      locName: currmodule?.location?.locName!
    },
    seatLimit:currmodule?.seatLimit,
    seatsAssigned: remseats + this.newcount,
    seatsUnassigned: currmodule?.seatLimit! - (remseats + this.newcount)
    }
    this.modservice.updateModule(this.updatedModule).subscribe({
      next: ()=>{
        this.loadDetails()
        this.cdr.detectChanges()
      }
    })
  }

  logout(){
    this.router.navigate(['/login'])
  }

}
