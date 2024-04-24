import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { teacher } from '../models/teacher.model';
import { course } from '../models/course.model';
import { section } from '../models/section.model';
import { Class } from '../models/class.model';
import { subject } from '../models/subject.model';
import { subject1 } from '../models/subject1.model';

@Component({
  selector: 'app-addteacher',
  templateUrl: './addteacher.component.html',
  styleUrl: './addteacher.component.css'
})
export class AddteacherComponent implements OnInit{
  formGrp:FormGroup;
  courses: Array<course>=[];
  classes: Array<Class>=[];
  sections: Array<section>=[];
  subjects: Array<subject>=[];
  subj:Array<subject1>=[];
  subj1:Array<subject1>=[];
  constructor(private fb:FormBuilder, private studentService:StudentService,private router:Router){
    this.formGrp=fb.group({
      mobileNumber:['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      eMail:['',[Validators.required,Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")]],
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z ]+$")]]
    })
  }
  ngOnInit(): void {
    this.studentService.getCourses().subscribe((courses: any) => {
      this.courses = courses;
    });
  }
  get mobno(){
    return this.formGrp.controls;
  }
  addTeacherrequest:teacher={
    id:0,
    name:'',
    email:'',
    mobile:'',
    courseId:0,
    classId:0,
    sectionId:0,
    dataArray:'',
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  }
  addsubrequest:subject1={
    courseName:'',
    className:'',
    sectionName:'',
    name:''
  }
  addTeacher(){
    this.studentService.addTeacher(this.addTeacherrequest).subscribe({
      next:(role:any)=>{
        this.router.navigate(['students/teacher']);
      }
    });
  }
  courseName(name:string){
    this.addsubrequest.courseName=name;
  }
  className(name:string){
    this.addsubrequest.className=name;
  }
  sectionName(name:string){
    this.addsubrequest.sectionName=name;
  }
  subjectName(name:string){
    this.addsubrequest.name=name;
  }
  sub:string='';
  checkedValues: string[] = [];
  addsubjects:string='';
  addsubjects1:string[]=[];
  handleChange(event: any,name:string) {
    this.sub=event.target.value.toString();
    if (event.target.checked) {
      this.checkedValues.push(this.addTeacherrequest.courseId.toString());
      this.checkedValues.push(this.addTeacherrequest.classId.toString());
      this.checkedValues.push(this.addTeacherrequest.sectionId.toString());
      this.checkedValues.push(this.sub);
      this.addsubjects=this.checkedValues.join(',');
      this.checkedValues=[];
      if(!this.addsubjects1.includes(this.addsubjects)){
      this.addsubjects1.push(this.addsubjects);
      }
      const newSubRequest: subject1 = {
        courseName: this.addsubrequest.courseName,
        className: this.addsubrequest.className,
        sectionName: this.addsubrequest.sectionName,
        name: name
      };
      this.subj1.push(newSubRequest);
    }if (!event.target.checked) {
      this.checkedValues.push(this.addTeacherrequest.courseId.toString());
      this.checkedValues.push(this.addTeacherrequest.classId.toString());
      this.checkedValues.push(this.addTeacherrequest.sectionId.toString());
      this.checkedValues.push(this.sub);
      this.addsubjects=this.checkedValues.join(',');
      this.checkedValues=[];
      this.addsubjects1.splice(this.addsubjects1.indexOf(this.addsubjects),1);
      const newSubRequest: subject1 = {
        courseName: this.addsubrequest.courseName,
        className: this.addsubrequest.className,
        sectionName: this.addsubrequest.sectionName,
        name: name
      };
      this.subj1.splice(this.subj1.indexOf(newSubRequest),1);
    }
  }
  btnClick1(){
    this.router.navigateByUrl('students/teacher');
  };
  getLoggedInUserName(): string {
    const user = this.studentService.getLoggedInUser();
    return user;
  }
  addMoreSubjects() {
    this.subj1.forEach((value)=>{
      if(!this.subj.includes(value))
      this.subj.push(value);
    })
    // this.addsubjects1.forEach( (value) => {
    //   if(!this.addTeacherrequest.subjects.includes(value))
    //   this.addTeacherrequest.subjects.push(value);
    // });
    this.addTeacherrequest.dataArray=this.addsubjects1.join(';');
    this.addTeacherrequest.courseId = 0;
    this.addTeacherrequest.classId = 0;
    this.addTeacherrequest.sectionId = 0;
    console.log(this.addTeacherrequest)
}
  selectedco:string='--Select Course--';
  selectedcl:string='--Select Class--';
  selectedse:string='--Select Section--';
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
  onCourseChange(event:any) {
    let id =event.target.value;
    if (id) {
      this.studentService.getClassesByCourse(id).subscribe((classes: any) => {
        this.classes = classes;
      });
    } 
  }
  onClassChange(event:any) {
    let id =event.target.value;
    if (id) {
      this.studentService.getSectionsByClass(id).subscribe((sections: any) => {
        this.sections = sections;
      });
    } 
  }
  getsubject(event:any){
    let id =event.target.value;
    if(id){
      this.studentService.getSubjectByClassId(id).subscribe((subjects:any)=>{
        this.subjects=subjects;
      })
    }
  }
}
