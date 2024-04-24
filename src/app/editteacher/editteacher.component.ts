import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student/student.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';
import { teacher } from '../models/teacher.model';
import { teacher1 } from '../models/teacher1.model';

@Component({
  selector: 'app-editteacher',
  templateUrl: './editteacher.component.html',
  styleUrl: './editteacher.component.css'
})
export class EditteacherComponent implements OnInit{
  formGrp:FormGroup; 
  constructor(private fb:FormBuilder,private route:ActivatedRoute,private service:StudentService,private router:Router,private mat:MatDialog,private dia:DialogComponent){
    this.formGrp=fb.group({
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z ]+$")]]
    })
  }
  get mobno(){
    return this.formGrp.controls;
  }

  editTeacherrequest:teacher1={
    id: 0,
    name: '',
    email:'',
    mobile:'',
    courseName:'',
    className:'',
    sectionName:'',
    subjectName:''
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next:(params)=>{
        const id=params.get('id');
        if(id){
          this.service.getTeacher(id).subscribe({
            next:(response)=>{
              this.editTeacherrequest=response;
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
      this.updateteacher();
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
  updateteacher(){
    this.service.updateTeacher(this.editTeacherrequest.id,this.editTeacherrequest).subscribe({
      next:(response)=>{
        this.router.navigate(['students/teacher']);
      }
    });
  }

  btnClick1(){
    this.router.navigateByUrl('students/teacher');
  };
  getLoggedInUserName(): string {
    const user = this.service.getLoggedInUser();
    return user;
  }
}
