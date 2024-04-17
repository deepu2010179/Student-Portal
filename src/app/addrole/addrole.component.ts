import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { role } from '../models/role.model';

@Component({
  selector: 'app-addrole',
  templateUrl: './addrole.component.html',
  styleUrl: './addrole.component.css'
})
export class AddroleComponent implements OnInit{
  formGrp:FormGroup;
  constructor(private fb:FormBuilder, private studentService:StudentService,private router:Router){
    this.formGrp=fb.group({
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z ]+$")]]
    })
  }
  ngOnInit(): void {
      
  }
  get mobno(){
    return this.formGrp.controls;
  }
  addRolerequest:role={
    id:0,
    role_name:''
  }
  addRole(){
    this.studentService.addRole(this.addRolerequest).subscribe({
      next:(role:any)=>{
        this.router.navigate(['students/role']);
      }
    });
  }
  btnClick1(){
    this.router.navigateByUrl('students/role');
  };
  getLoggedInUserName(): string {
    const user = this.studentService.getLoggedInUser();
    return user;
  }
}
