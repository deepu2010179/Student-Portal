import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { AbstractControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { user } from '../models/user.model';
import { userrole } from '../models/userrole.model';
import * as bcrypt from 'bcryptjs';
import { role } from '../models/role.model';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrl: './adduser.component.css'
})
export class AdduserComponent implements OnInit{
  formGrp:FormGroup;
  email:string;
  username:string;
  password:string;
  constructor(private fb:FormBuilder, private studentService:StudentService,private router:Router){
    this.email='';
    this.username='';
    this.password='';
    this.formGrp=fb.group({
      pass:['',[Validators.required,Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]],
      eMail:['',[Validators.required,Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")]],
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z0-9 ]+$")]]
    })
  }
  @ViewChild('admin') admin: ElementRef | undefined;
  @ViewChild('student') student: ElementRef | undefined;
  ngOnInit(): void {
    this.studentService.getAllRoles().subscribe({
      next:(roles)=>{
        this.roles=roles;
      }
    })
  }
  
  get mobno(){
    return this.formGrp.controls;
  }
  addUserrequest:user={
    id:0,
    username: '',
    email:'',
    hashed_password:'',
    isLocked:true,
    security_question_id:0,
    answer_id:0,
    roles:''
  }
  addRolerequest:userrole={
    id:0,
    user_id:0,
    role_id:0
  }
//   async hashPassword(password: string): Promise<string> {
//     const hashedPassword = await bcrypt.hash(password, 8);
//     return hashedPassword;
// }
  addUser(){
    this.addUserrequest.roles=this.checkedValues.join(',');
    this.studentService.addUser(this.addUserrequest).subscribe({
      next:(user:any)=>{
        this.router.navigate(['students/user']);
      }
    });
  }
  role:string='';
  checkedValues: string[] = [];
  handleChange(event: any) {
    this.role=event.target.value.toString();
    if (event.target.checked) {
      this.checkedValues.push(this.role);
      //this.role+=',';
    }if (!event.target.checked) {
      //this.role=event.target.value.toString();
      this.checkedValues.splice(this.checkedValues.indexOf(this.role),1);
      //this.role+=',';
    }
    //console.log(this.checkedValues);
  }
  btnClick1(){
    this.router.navigateByUrl('students/user');
  };
  getLoggedInUserName(): string {
    const user = this.studentService.getLoggedInUser();
    return user;
  }
  roles:role[]=[];

}
