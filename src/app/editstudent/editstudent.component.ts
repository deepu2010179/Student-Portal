import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../student/student.service';
import { student } from '../models/student.model';
import { student1 } from '../models/student1.model';
import { Router } from '@angular/router';
import { state } from '../models/state.model';
import { city } from '../models/city.model';
import { AbstractControl,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editstudent',
  templateUrl: './editstudent.component.html',
  styleUrl: './editstudent.component.css'
})
export class EditstudentComponent implements OnInit {
  @ViewChild('state') selectedState: ElementRef | undefined;
  formGrp:FormGroup; 
  mobile:string;
  email:string;
  constructor(private fb:FormBuilder,private route:ActivatedRoute,private studentservice:StudentService,private router:Router){
    this.mobile='';
    this.email='';
    this.formGrp=fb.group({
      mobileNumber:['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      eMail:['',[Validators.required,Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")]]
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
    maritalStatusName: ''
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
    createdBy:1,
    createdOn: new Date(),
    modifiedBy:1,
    modifiedOn: new Date()
  };

  states: Array<state>=[];
  cities: Array<city>=[];
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next:(params)=>{
        const id=params.get('id');
        if(id){
          this.studentservice.getStudent(id).subscribe({
            next:(response)=>{
              this.editStudentrequest1=response;
              this.getCities(this.editStudentrequest1.stateId);
            }
          });
        }

      }
    })
    this.studentservice.getStates().subscribe((states: any) => {
      this.states = states;
    });
  }
  updatestudent(){
    this.studentservice.updateStudent(this.editStudentrequest1.id,this.editStudentrequest1).subscribe({
      next:(response)=>{
        this.router.navigate(['students']);
      }
    });
  }
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
    }
