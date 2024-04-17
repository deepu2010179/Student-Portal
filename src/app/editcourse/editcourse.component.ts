import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student/student.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';
import { course } from '../models/course.model';
import { SharedService } from '../student/shared.service';

@Component({
  selector: 'app-editcourse',
  templateUrl: './editcourse.component.html',
  styleUrl: './editcourse.component.css'
})
export class EditcourseComponent implements OnInit{
  formGrp:FormGroup; 
  constructor(private fb:FormBuilder,private route:ActivatedRoute,private service:StudentService,private router:Router,private mat:MatDialog,private dia:DialogComponent,private sh:SharedService){
    this.formGrp=fb.group({
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z ]+$")]]
    })
  }
  get mobno(){
    return this.formGrp.controls;
  }

  editCourserequest:course={
    id: 0,
    name: '',
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  };
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next:(params)=>{
        const id=params.get('id');
        if(id){
          this.sh.setCourseId(id);
          this.service.getCourse(id).subscribe({
            next:(response)=>{
              this.editCourserequest=response;
            }
          });
        }
      }
    })
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
      this.updatecourse();
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
  updatecourse(){
    this.service.updateCourse(this.editCourserequest.id,this.editCourserequest).subscribe({
      next:(response)=>{
        this.router.navigate(['students/course']);
      }
    });
  }

  btnClick1(){
    this.router.navigateByUrl('students/course');
  };
  getLoggedInUserName(): string {
    const user = this.service.getLoggedInUser();
    return user;
  }
}
