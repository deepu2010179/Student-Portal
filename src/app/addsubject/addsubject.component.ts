import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../student/shared.service';
import { EditcourseComponent } from '../editcourse/editcourse.component';
import { Router } from '@angular/router';
import { StudentService } from '../student/student.service';
import { subject } from '../models/subject.model';

@Component({
  selector: 'app-addsubject',
  templateUrl: './addsubject.component.html',
  styleUrl: './addsubject.component.css'
})
export class AddsubjectComponent {
  formGrp:FormGroup;
  constructor(private fb:FormBuilder, private studentService:StudentService,private router:Router,private ed:EditcourseComponent,private sh:SharedService){
    this.formGrp=fb.group({
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z0-9 ]+$")]],
      Name2:['', [Validators.required, Validators.max(Number.MAX_SAFE_INTEGER)]]
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
  addSubjectrequest:subject={
    id:0,
    class_id:0,
    subjectCode:'',
    name:'',
    totalLectures:0,
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  }
  addSubject(){
    let firstChar = '';
    let middleChar = '';
    let lastChar = '';
    this.addSubjectrequest.class_id=Number(this.classId);
    const name=this.addSubjectrequest.name.toUpperCase().replace(/\s/g, '');
    if (name.length >= 1) {
      firstChar = name[0];
      lastChar = name[name.length - 1];
    }
    if (name.length >= 3) {
      middleChar = name[Math.floor(name.length / 2)];
    }
    const uniqueId = Math.floor(Math.random() * 1000);
    this.addSubjectrequest.subjectCode = firstChar.toUpperCase() + middleChar.toUpperCase() + lastChar.toUpperCase() + uniqueId;
    this.addSubjectrequest.subjectCode=this.addSubjectrequest.subjectCode+this.classId;
    this.studentService.addSubject(this.addSubjectrequest).subscribe({
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
