import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { course } from '../models/course.model';

@Component({
  selector: 'app-addcourse',
  templateUrl: './addcourse.component.html',
  styleUrl: './addcourse.component.css'
})
export class AddcourseComponent implements OnInit{
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
  addCourserequest:course={
    id:0,
    name:'',
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  }
  addCourse(){
    this.studentService.addCourse(this.addCourserequest).subscribe({
      next:(role:any)=>{
        this.router.navigate(['students/course']);
      }
    });
  }
  btnClick1(){
    this.router.navigateByUrl('students/course');
  };
  getLoggedInUserName(): string {
    const user = this.studentService.getLoggedInUser();
    return user;
  }
}
