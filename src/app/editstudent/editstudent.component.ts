import { Component, OnInit,ElementRef, ViewChild,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../student/student.service';
import { student } from '../models/student.model';
import { student1 } from '../models/student1.model';
import { Router } from '@angular/router';
import { state } from '../models/state.model';
import { city } from '../models/city.model';
import { AbstractControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent,ConfirmDialogModel } from '../dialog/dialog.component';
import { course } from '../models/course.model';
import { Class } from '../models/class.model';
import { section } from '../models/section.model';

@Component({
  selector: 'app-editstudent',
  templateUrl: './editstudent.component.html',
  styleUrl: './editstudent.component.css'
})
export class EditstudentComponent implements OnInit {
  @ViewChild('state') selectedState: ElementRef | undefined;
  @ViewChild('course') selectedCourse: ElementRef | undefined;
  @ViewChild('class') selectedClass: ElementRef | undefined;
  formGrp:FormGroup; 
  mobile:string;
  email:string;
  constructor(private cdr: ChangeDetectorRef,private fb:FormBuilder,private route:ActivatedRoute,private studentservice:StudentService,private router:Router,private mat:MatDialog,private dia:DialogComponent){
    this.mobile='';
    this.email='';
    this.formGrp=fb.group({
      mobileNumber:['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      eMail:['',[Validators.required,Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")]],
    })
  }
  get mobno(){
    return this.formGrp.controls;
  }

  editStudentrequest:student={
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
  editStudentrequest1:student1={
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
    createdBy:1,
    createdOn: new Date(),
    modifiedBy:1,
    modifiedOn: new Date()
  };
  selectedcl:string='--Select Class--';
  selectedse:string='--Select Section--';
  states: Array<state>=[];
  cities: Array<city>=[];
  courses: Array<course>=[];
  classes: Array<Class>=[];
  sections: Array<section>=[];
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next:(params)=>{
        const id=params.get('id');
        if(id){
          this.studentservice.getStudent(id).subscribe({
            next:(response)=>{
              this.editStudentrequest1=response;
              this.getCities(this.editStudentrequest1.stateId);
              this.getClasses(this.editStudentrequest1.courseId);
              this.getSections(this.editStudentrequest1.classId);
            }
          });
        }

      }
    })
    this.studentservice.getStates().subscribe((states: any) => {
      this.states = states;
    });
    this.studentservice.getCourses().subscribe((courses: any) => {
      this.courses = courses;
    });
  }
  onCourseChange() {
    let id = this.selectedCourse?.nativeElement.value;
    if (id) {
      this.studentservice.getClassesByCourse(id).subscribe((classes: any) => {
        this.classes = classes;
      });
    } 
  }
  onClassChange() {
    let id = this.selectedClass?.nativeElement.value;
    if (id) {
      this.studentservice.getSectionsByClass(id).subscribe((sections: any) => {
        this.sections = sections;
      });
    } 
  }
  confirmDialog(): void {
    const message = `Are you sure you want to Edit ?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.mat.open(DialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
  
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult)
      this.updatestudent();
      setTimeout(() => {
        this.cdr.detectChanges();
      });
    });
  }
//   txt:boolean=false;
// conf(){
//   if (confirm("Are you sure ?")) {
//     this.txt = true;
//   } else {
//     this.txt = false;
//   }
//   if(this.txt)
//   this.updatestudent();
// }
  updatestudent(){
    this.studentservice.updateStudent(this.editStudentrequest1.id,this.editStudentrequest1).subscribe({
      next:(response)=>{
        this.router.navigate(['students']);
      }
    });
  }
  selecteds:string='--Select State--';
  selectedc:string='--Select City--';
  selectedms:string='--Select Marital Status--';
  onStateChange() {
    let id = this.selectedState?.nativeElement.value;
    this.getCities(id);
  }
    getCities(id:number){
      if (id) {
        this.studentservice.getCitiesByState(id).subscribe((cities: any) => {
          this.cities = cities;
        });
      } 
    }
    getClasses(id:number){
      if (id) {
        this.studentservice.getClassesByCourse(id).subscribe((classes: any) => {
          this.classes = classes;
        });
      } 
    }
    getSections(id:number){
      if (id) {
        this.studentservice.getSectionsByClass(id).subscribe((sections: any) => {
          this.sections = sections;
        });
      } 
    }
    bool1:boolean=false;
  Checkemail(email:string){
    this.studentservice.checkemail(email).subscribe((bool:boolean)=>{
      this.bool1 = bool;
    });
  }
  bool2:boolean=false;
  Checkmobile(mobile:string){
    this.studentservice.checkmobile(mobile).subscribe((bool:boolean)=>{
      this.bool2 = bool;
    });
  }
  btnClick1(){
    this.router.navigateByUrl('students');
  };
  getLoggedInUserName(): string {
    const user = this.studentservice.getLoggedInUser();
    return user;
  }
}
