import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
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
  constructor(private fb:FormBuilder,private route:ActivatedRoute,private studentservice:StudentService,private router:Router,private mat:MatDialog,private dia:DialogComponent){
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
