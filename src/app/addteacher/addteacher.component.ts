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
import { SharedService } from '../student/shared.service';
import { subject2 } from '../models/subject2.model';

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
  constructor(private fb:FormBuilder, private studentService:StudentService,private router:Router,private sh:SharedService){
    this.formGrp=fb.group({
      mobileNumber:['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      eMail:['',[Validators.required,Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")]],
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z ]+$")]]
    })
  }
  ind:number=-1;
  ngOnInit(): void {
    this.studentService.getCourses().subscribe((courses: any) => {
      this.courses = courses;
    });
    this.ind=-1;
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
  addsubrequest:subject1={
    courseName:'',
    className:'',
    sectionName:'',
    name:''
  }
  addsubjectrequest:subject2={
    id:0,
    teacherId:0,
    courseId:0,
    classId:0,
    sectionId:0,
    subjectIds:'',
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  }
  addTeacher(){
    this.studentService.addTeacher(this.addTeacherrequest).subscribe((data)=>{
      this.sh.setTeacherId(data.id);
    })
    this.ind=0;
    this.sh.teacherId$.subscribe(id => {
      this.addsubjectrequest.teacherId = id;
    });
  }
  addSubjects(){
    this.addsubjectrequest.subjectIds=this.checkedValues1.join(',');
    this.studentService.addTeacherSubjects(this.addsubjectrequest).subscribe((data)=>{
    })
    this.checkedValues1=[];
  }
  handleButtonClick() {
    this.addSubjects();
    this.addMoreSubjects();
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
  checkedValues1: string[] = [];
  addsubjects:string='';
  addsubjects1:string[]=[];
  handleChange(event: any,name:string) {
    this.sub=event.target.value.toString();
    if (event.target.checked) {
      this.checkedValues.push(this.addsubjectrequest.courseId.toString());
      this.checkedValues.push(this.addsubjectrequest.classId.toString());
      this.checkedValues.push(this.addsubjectrequest.sectionId.toString());
      this.checkedValues.push(this.sub);
      this.checkedValues1.push(this.sub);
      this.addsubjects=this.checkedValues.join(',');
      this.checkedValues=[];
      if(!this.addsubjects1.includes(this.addsubjects)){
      this.addsubjects1.push(this.addsubjects);
      console.log(this.addsubjectrequest);
      }
      const newSubRequest: subject1 = {
        courseName: this.addsubrequest.courseName,
        className: this.addsubrequest.className,
        sectionName: this.addsubrequest.sectionName,
        name: name
      };
      this.subj1.push(newSubRequest);
      console.log(this.subj1)
    }if (!event.target.checked) {
      this.checkedValues.push(this.addsubjectrequest.courseId.toString());
      this.checkedValues.push(this.addsubjectrequest.classId.toString());
      this.checkedValues.push(this.addsubjectrequest.sectionId.toString());
      this.checkedValues.push(this.sub);
      this.checkedValues1.splice(this.checkedValues1.indexOf(this.sub),1);
      this.addsubjects=this.checkedValues.join(',');
      this.checkedValues=[];
      this.addsubjects1.splice(this.addsubjects1.indexOf(this.addsubjects),1);
      const indexToRemove = this.subj1.findIndex(sub => sub.courseName === this.addsubrequest.courseName &&
        sub.className === this.addsubrequest.className &&
        sub.sectionName === this.addsubrequest.sectionName &&
        sub.name === name);
        if(indexToRemove!=-1)
      this.subj1.splice(indexToRemove,1);
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
    // this.addsubjectrequest.dataArray=this.addsubjects1.join(';');
    this.addsubjectrequest.courseId = 0;
    this.addsubjectrequest.classId = 0;
    this.addsubjectrequest.sectionId = 0;
}
removeSubject(subject: subject1) {
  const index = this.subj1.findIndex(sub => 
    sub.courseName === subject.courseName &&
    sub.className === subject.className &&
    sub.sectionName === subject.sectionName &&
    sub.name === subject.name
  );
  if (index !== -1) {
    this.subj1.splice(index, 1);
  }
  const subjIndex = this.subj.findIndex(sub =>
    sub.courseName === subject.courseName &&
    sub.className === subject.className &&
    sub.sectionName === subject.sectionName &&
    sub.name === subject.name
  );
  if (subjIndex !== -1) {
    this.subj.splice(subjIndex, 1);
  }
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
