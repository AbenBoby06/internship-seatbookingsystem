import { Component,OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'
import { BookedSeat } from '../../interface/booked-seat';
import { Employee } from '../../interface/employee';
import { Seats } from '../../interface/seats';
import { Location } from '../../interface/location';
import { BookedSeatService } from '../../services/booked-seat';
import { EmployeeService } from '../../services/employee';
import { SeatsService } from '../../services/seats';
import { Unbookedseat } from '../../interface/unbookedseat';
import { LocationService } from '../../services/location';
import { Departments } from '../../interface/departments';
import { DepartmentService } from '../../services/department';
import { Project } from '../../interface/project';
import { ProjectService } from '../../services/project';
import { Module } from '../../interface/module';
import { ModuleService } from '../../services/module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emp',
  imports: [CommonModule],
  templateUrl: './emp.html',
  styleUrl: './emp.scss',
})
export class Emp implements OnInit{
  location: Location[] = []
  dates: string[] = []
  seats: Seats[] = []
  employees: Employee[] = []
  bookedseat: BookedSeat[] = []
  bookedseatid: number[] = []
  unbookedseat: Unbookedseat[] = []
  department: Departments[] = []
  project: Project[] = []
  module: Module[] = []
  fromdate: string = ''
  todate: string = ''
  empid: number = 0
  empname: string = ''
  empdept: string = ''
  loc: string = ''
  locid: number = 0
  proj: string = ''
  projid: number = 0
  getsugbool = false
  myseatbool = false
  seatavailablebyoffice = 1
  newBookedSeat: BookedSeat = {
    empId: 0,
    seatId:0,
    date:''
  }
  showheader: boolean = false
  seatsbooked:boolean = false

  constructor(private bookedseatservice: BookedSeatService,
              private employeeservice: EmployeeService,
              private cdr: ChangeDetectorRef,
              private seatservice: SeatsService,
              private locservice: LocationService,
              private deptservice: DepartmentService,
              private projservice: ProjectService,
              private modservice: ModuleService,
              private router: Router
  ){}

    ngOnInit():void{
    this.empid = Number(
      localStorage.getItem('empId')
    )
    this.loaddata();
    
  }

  seatbooked(){
    this.seatsbooked = this.bookedseat.some(seat=> seat.empId === this.empid);
  }

  loaddata(){
    this.employeeservice.getEmployee().subscribe(
      data=>{
        this.employees = data;
        for(const emp of this.employees){
          if(emp.empId == this.empid){
            this.empname = emp.empName;
            this.empdept = emp.empDept;
          }
        }
        this.cdr.detectChanges();
      }
    );
    this.bookedseatservice.getBookedSeat().subscribe(data=>{
      this.bookedseat = data;
      this.seatbooked();
      this.cdr.detectChanges();
    });
    this.seatservice.getSeats().subscribe(data =>{
      this.seats = data;
    })
    this.locservice.getLocation().subscribe(data =>{
      this.location = data;
    })
    this.deptservice.getDepartment().subscribe(data =>{
      this.department = data;
    })
    this.projservice.getProject().subscribe(data =>{
      this.project = data
    })
    this.modservice.getModule().subscribe(data=>{
      this.module = data
    })
  }

  getlocid(){
    for(const loc of this.location){
      //console.log("location is",this.loc)
      if(this.loc == loc.locName){
        this.locid = loc.locId
      }
    }
  }

  getprojid(){
    for(const proj of this.project){
      if(this.proj == proj.projName){
        this.projid = proj.projId;
      }
    }
  }

  generatedates(from: string, to: string){
    this.dates = [];
    let currentdate = new Date(from);
    let lastdate = new Date(to);

    while(currentdate <= lastdate){
      this.dates.push(
        currentdate.toISOString().split('T')[0]
      );
      currentdate.setDate(currentdate.getDate()+1);
    }
  }

  checkseats(from: string, to: string){
    this.getsuggestion();
    this.fromdate = from;
    this.todate = to
    this.showheader = true
    this.generatedates(this.fromdate,this.todate);
    this.getlocid();
    this.getprojid();
    let seatavailablebyproject = 0
    let seatsavailablebymodule = 0
    let seatsavailablebydept = 0
    
    //console.log("location id is",this.locid);
    this.unbookedseat = [];
    for(const date of this.dates){
      this.bookedseatid = [];
      for(const bookedseat of this.bookedseat){
        if(date == bookedseat.date){
          this.bookedseatid.push(bookedseat.seatId);
        }
      }

      for(const seat of this.seats){
        const matcheddept = this.department.find(d=>d.deptId === seat.module?.deptId)
        const safedept = matcheddept ? matcheddept.deptName : 'unknown department'
        //console.log(matcheddept)
        //console.log(safedept)
        if(!this.bookedseatid.includes(seat.seatId) && seat.module?.locId == this.locid && seat.projId == this.projid){
          this.unbookedseat.push({
            seatId: seat.seatId,
            seatName: seat.seatName,
            projName: seat.project.projName,
            department: safedept,
            moduleName: seat.module.moduleName,
            floorNo: seat.module.floorNo,
            date: date
          })
          seatavailablebyproject++
        }
      }
      if(seatavailablebyproject == 0){
        let projinmod: Number[] = []
        for(const mod of this.module){
          let projinseats: Number[] = []
          for(const seat of this.seats){
            if(seat.moduleId == mod.moduleId && seat.module?.deptId == mod.deptId){
              projinseats.push(seat.projId);
            }
          }
          if(projinseats.includes(this.projid)){
            projinmod.push(mod.moduleId!)
          }
        }
        for(const seat of this.seats){
          const matcheddept = this.department.find(d=>d.deptId === seat.module?.deptId)
          const safedept = matcheddept ? matcheddept.deptName : 'unknown department'
          if(!this.bookedseatid.includes(seat.seatId) && seat.module?.locId == this.locid && projinmod.includes(seat.moduleId)){
            this.unbookedseat.push({
              seatId: seat.seatId,
              seatName: seat.seatName,
              projName: seat.project.projName,
              department: safedept,
              moduleName: seat.module.moduleName,
              floorNo: seat.module.floorNo,
              date: date
            })
            seatsavailablebymodule++
          }
        }
        if(seatsavailablebymodule == 0){
          for(const seat of this.seats){
          const matcheddept = this.department.find(d=>d.deptId === seat.module?.deptId)
          const safedept = matcheddept ? matcheddept.deptName : 'unknown department'
          if(!this.bookedseatid.includes(seat.seatId) && seat.module?.locId == this.locid && matcheddept?.deptName == this.empdept){
            this.unbookedseat.push({
              seatId: seat.seatId,
              seatName: seat.seatName,
              projName: seat.project.projName,
              department: safedept,
              moduleName: seat.module.moduleName,
              floorNo: seat.module.floorNo,
              date: date
            })
            seatsavailablebydept++
          }
        }
        if(seatsavailablebydept == 0){
        this.seatavailablebyoffice = 0
          for(const seat of this.seats){
          const matcheddept = this.department.find(d=>d.deptId === seat.module?.deptId)
          const safedept = matcheddept ? matcheddept.deptName : 'unknown department'
          //console.log(matcheddept)
          //console.log(safedept)
          if(!this.bookedseatid.includes(seat.seatId) && seat.module?.locId == this.locid){
            this.unbookedseat.push({
              seatId: seat.seatId,
              seatName: seat.seatName,
              projName: seat.project.projName,
              department: safedept,
              moduleName: seat.module.moduleName,
              floorNo: seat.module.floorNo,
              date: date
            })
            this.seatavailablebyoffice++
          }
        }
      }
      }
      }
      
      
      
      seatsavailablebydept = 0;
      seatavailablebyproject = 0;
      seatsavailablebymodule = 0;
    }
    console.log(this.seatavailablebyoffice)
  }

  bookseat(seat: Unbookedseat){
    this.newBookedSeat = {
      empId: this.empid,
      seatId: seat.seatId,
      date: seat.date
    }
    this.bookedseatservice.addBookedSeat(this.newBookedSeat).subscribe(()=>{
      this.unbookedseat = this.unbookedseat.filter(
          s => !(s.seatId == seat.seatId && s.date == seat.date)
        );
      this.bookedseatservice.getBookedSeat().subscribe(data=>{
        this.bookedseat = data;
        this.seatbooked();
        this.checkseats(this.fromdate, this.todate);
        this.cdr.detectChanges();
      })
      
    })
  }

  isDateAlreadyBooked(date: string): boolean{
    return this.bookedseat.some(d=>
      d.date === date
    )
  }

  cancelbooking(seatid: number){
    const deletedSeat = this.bookedseat.find(s=>s.id === seatid)
    if(deletedSeat){
      //console.log("from before assigning",this.fromdate);
      //console.log("to before assigning",this.todate);
      this.fromdate = deletedSeat.date;
      this.todate = deletedSeat.date;
      this.locid = deletedSeat.seats?.module?.locId ?? 0; 
      this.loc = deletedSeat.seats?.module?.location?.locName ?? '';
      //console.log("from after assigning",this.fromdate);
      //console.log("to after assigning",this.todate);
    }
    this.bookedseatservice.deleteBookedSeat(seatid).subscribe(()=>{
      this.loaddata();
      this.bookedseatservice.getBookedSeat().subscribe({
        next:(data)=>{
        this.bookedseat = data;
        this.seatbooked();
        if(this.fromdate && this.todate){
        this.checkseats(this.fromdate,this.todate);
        }
        this.cdr.detectChanges();
      }})
    })
  }

  getsuggestion(){
    this.getsugbool = true
    this.myseatbool = false
  }

  mybookedseat(){
    this.getsugbool = false
    this.myseatbool = true
  }

  Logout(){
    this.router.navigate(['/login'])
  }

}

  