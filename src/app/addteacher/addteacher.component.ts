import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { teacher } from '../models/teacher.model';

@Component({
  selector: 'app-addteacher',
  templateUrl: './addteacher.component.html',
  styleUrl: './addteacher.component.css'
})
export class AddteacherComponent implements OnInit{
  formGrp:FormGroup;
  constructor(private fb:FormBuilder, private studentService:StudentService,private router:Router){
    this.formGrp=fb.group({
      mobileNumber:['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      eMail:['',[Validators.required,Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")]],
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z ]+$")]]
    })
  }
  ngOnInit(): void {
      
  }
  get mobno(){
    return this.formGrp.controls;
  }
  addTeacherrequest:teacher={
    id:0,
    name:'',
    email:'',
    mobile:'',
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  }
  addTeacher(){
    this.studentService.addTeacher(this.addTeacherrequest).subscribe({
      next:(role:any)=>{
        this.router.navigate(['students/teacher']);
      }
    });
  }
  btnClick1(){
    this.router.navigateByUrl('students/teacher');
  };
  getLoggedInUserName(): string {
    const user = this.studentService.getLoggedInUser();
    return user;
  }
  bool1:boolean=false;
  Checkemail(email:string){
    this.studentService.checkemailt(email).subscribe((bool:boolean)=>{
      this.bool1 = bool;
    });
  }
  bool2:boolean=false;
  Checkmobile(mobile:string){
    this.studentService.checkmobilet(mobile).subscribe((bool:boolean)=>{
      this.bool2 = bool;
    });
  }
}
