import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { Class } from '../models/class.model';
import { EditcourseComponent } from '../editcourse/editcourse.component';
import { SharedService } from '../student/shared.service';

@Component({
  selector: 'app-addclass',
  templateUrl: './addclass.component.html',
  styleUrl: './addclass.component.css'
})
export class AddclassComponent implements OnInit{
  formGrp:FormGroup;
  constructor(private fb:FormBuilder, private studentService:StudentService,private router:Router,private ed:EditcourseComponent,private sh:SharedService){
    this.formGrp=fb.group({
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z ]+$")]],
      Name2:['',[Validators.required,Validators.pattern("^[A-Za-z0-9 ]+$")]]
    })
  }
  public courseId:string|null='';
  ngOnInit(): void {
    this.sh.courseId$.subscribe(id => {
      this.courseId = id;
    });
  }
  get mobno(){
    return this.formGrp.controls;
  }
  addClassrequest:Class={
    id:0,
    course_id:0,
    name:'',
    session:'',
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  }
  addClass(){
    this.addClassrequest.course_id=Number(this.courseId);
    this.studentService.addClass(this.addClassrequest).subscribe({
      next:(role:any)=>{
        this.router.navigate(['/students/course','edit',this.courseId]);
      }
    });
  }
  btnClick1(){
    this.router.navigate(['/students/course','edit',this.courseId]);
  };
  getLoggedInUserName(): string {
    const user = this.studentService.getLoggedInUser();
    return user;
  }
}
