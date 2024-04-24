import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { student } from '../models/student.model';
import { student1 } from '../models/student1.model';
import { state } from '../models/state.model';
import { city } from '../models/city.model';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { AbstractControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { course } from '../models/course.model';
import { Class } from '../models/class.model';
import { section } from '../models/section.model';

@Component({
  selector: 'app-addstudent',
  templateUrl: './addstudent.component.html',
  styleUrl: './addstudent.component.css'
})
export class AddstudentComponent implements OnInit{
  formGrp:FormGroup; 
  mobile:string;
  email:string;
  name:string;
  @ViewChild('state') selectedState: ElementRef | undefined;
  @ViewChild('course') selectedCourse: ElementRef | undefined;
  @ViewChild('class') selectedClass: ElementRef | undefined;
  constructor(private fb:FormBuilder, private studentService:StudentService,private router:Router){
    this.mobile='';
    this.email='';
    this.name='';
    this.formGrp=fb.group({
      mobileNumber:['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      eMail:['',[Validators.required,Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")]],
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z ]+$")]]
    })
  }
  get mobno(){
    return this.formGrp.controls;
  }
  maritals = ['Single','Married','Separated'];
  addStudentrequest:student={
    id: 0,
    code: '',
    name: '',
    email: '',
    mobile: '',
    address1: '',
    address2: '',
    stateName: '',
    cityName: '',
    genderName: '',
    maritalStatusName: '',
    courseName:'',
    className:'',
    sectionName:''
  };
  addStudentrequest1:student1={
    id: 0,
    code: '',
    name: '',
    email: '',
    mobile: '',
    address1: '',
    address2: '',
    stateId: 0,
    cityId: 0,
    gender: 0,
    maritalStatus: 0,
    courseId:0,
    classId:0,
    sectionId:0,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  };
  states: Array<state>=[];
  cities: Array<city>=[];
  courses: Array<course>=[];
  classes: Array<Class>=[];
  sections: Array<section>=[];
  selectedRecords: Array<student> = [];
 
  ngOnInit(): void {
    this.studentService.getStates().subscribe((states: any) => {
      this.states = states;
    });
    this.studentService.getCourses().subscribe((courses: any) => {
      this.courses = courses;
    });
  }
  onStateChange() {
    let id = this.selectedState?.nativeElement.value;
    if (id) {
      this.studentService.getCitiesByState(id).subscribe((cities: any) => {
        this.cities = cities;
      });
    } 
  }
  onCourseChange() {
    let id = this.selectedCourse?.nativeElement.value;
    if (id) {
      this.studentService.getClassesByCourse(id).subscribe((classes: any) => {
        this.classes = classes;
      });
    } 
  }
  onClassChange() {
    let id = this.selectedClass?.nativeElement.value;
    if (id) {
      this.studentService.getSectionsByClass(id).subscribe((sections: any) => {
        this.sections = sections;
      });
    } 
  }
  addStudent(){
    this.studentService.addStudent(this.addStudentrequest1).subscribe({
      next:(student)=>{
        this.router.navigate(['students']);
      }
    });
  }
  selecteds:string='--Select State--';
  selectedc:string='--Select City--';
  selectedms:string='--Select Marital Status--';
  selectedco:string='--Select Course--';
  selectedcl:string='--Select Class--';
  selectedse:string='--Select Section--';
  bool1:boolean=false;
  Checkemail(email:string){
    this.studentService.checkemail(email).subscribe((bool:boolean)=>{
      this.bool1 = bool;
    });
  }
  bool2:boolean=false;
  Checkmobile(mobile:string){
    this.studentService.checkmobile(mobile).subscribe((bool:boolean)=>{
      this.bool2 = bool;
    });
  }
  btnClick1(){
    this.router.navigateByUrl('students');
  };
  getLoggedInUserName(): string {
    const user = this.studentService.getLoggedInUser();
    return user;
  }
}
