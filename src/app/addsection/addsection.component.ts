import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { EditcourseComponent } from '../editcourse/editcourse.component';
import { SharedService } from '../student/shared.service';
import { section } from '../models/section.model';

@Component({
  selector: 'app-addsection',
  templateUrl: './addsection.component.html',
  styleUrl: './addsection.component.css'
})
export class AddsectionComponent {
  formGrp:FormGroup;
  constructor(private fb:FormBuilder, private studentService:StudentService,private router:Router,private ed:EditcourseComponent,private sh:SharedService){
    this.formGrp=fb.group({
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z0-9 ]+$")]]
    })
  }
  public classId:string|null='';
  ngOnInit(): void {
    this.sh.classId$.subscribe(id => {
      this.classId = id;
    });
  }
  get mobno(){
    return this.formGrp.controls;
  }
  addSectionrequest:section={
    id:0,
    class_id:0,
    name:'',
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  }
  addSection(){
    this.addSectionrequest.class_id=Number(this.classId);
    this.studentService.addSection(this.addSectionrequest).subscribe({
      next:(role:any)=>{
        this.router.navigate(['/students/class','edit',this.classId]);
      }
    });
  }
  btnClick1(){
    this.router.navigate(['/students/class','edit',this.classId]);
  };
  getLoggedInUserName(): string {
    const user = this.studentService.getLoggedInUser();
    return user;
  }
}
