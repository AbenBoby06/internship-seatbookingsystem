import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../interface/employee';
import { EmployeeService } from '../../services/employee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit{
  employees: Employee[] = []
  id:number = 0
  dept:string = ''

  constructor(private employeeService: EmployeeService,
              private router: Router
  ){}

  ngOnInit(): void{
    this.loadEmployees();
  }

  loadEmployees(){
    this.employeeService.getEmployee().subscribe(
      data=>{
        this.employees = data;
      }
    );
  }

  

  login(){
    for(const employee of this.employees){
      if(employee.empId == this.id){
        this.dept = employee.empDept
        localStorage.setItem('empId',this.id.toString());
      }
    }
    if(this.dept != 'HR'){
      this.router.navigate(['/emp']);
    }
    else if(this.dept == 'HR'){
      this.router.navigate(['/hr']);
    }
  }
}
