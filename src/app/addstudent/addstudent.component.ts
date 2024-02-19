import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { student } from '../models/student.model';
import { student1 } from '../models/student1.model';
import { state } from '../models/state.model';
import { city } from '../models/city.model';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { AbstractControl,FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  doSubmit(){
    console.log(this.formGrp.value);
    console.log(this.mobile);
  }
  doSubmit1(){
    console.log(this.formGrp.value);
    console.log(this.email);
  }
  doSubmit2(){
    console.log(this.formGrp.value);
    console.log(this.name);
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
    maritalStatusName: ''
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
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  };
  states: Array<state>=[];
  cities: Array<city>=[];
  selectedRecords: Array<student> = [];
 

  ngOnInit(): void {
    this.studentService.getStates().subscribe((states: any) => {
      this.states = states;
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
  addStudent(){
    this.studentService.addStudent(this.addStudentrequest1).subscribe({
      next:(student)=>{
        this.router.navigate(['students']);
        window.alert("Student Added")
      }
    });
  }
}
