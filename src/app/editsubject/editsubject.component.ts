import { Component } from '@angular/core';
import { subject } from '../models/subject.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student/student.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';
import { SharedService } from '../student/shared.service';

@Component({
  selector: 'app-editsubject',
  templateUrl: './editsubject.component.html',
  styleUrl: './editsubject.component.css'
})
export class EditsubjectComponent {
  formGrp:FormGroup; 
  constructor(private fb:FormBuilder,private route:ActivatedRoute,private service:StudentService,private router:Router,private mat:MatDialog,private dia:DialogComponent,private sh:SharedService){
    this.formGrp=fb.group({
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z ]+$")]]
    })
  }
  get mobno(){
    return this.formGrp.controls;
  }

  editSubjectrequest:subject={
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
  };
  public classId:string|null='';
  ngOnInit(): void {
    this.sh.classId$.subscribe(id => {
      this.classId = id;
    });
    this.route.paramMap.subscribe({
      next:(params)=>{
        const id=params.get('id');
        if(id){
          this.service.getSubject(id).subscribe({
            next:(response)=>{
              this.editSubjectrequest=response;
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
      this.updatesubject();
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
  updatesubject(){
    this.service.updateSubject(this.editSubjectrequest.id,this.editSubjectrequest).subscribe({
      next:(response)=>{
        this.router.navigate(['/students/class','edit',this.classId]);
      }
    });
  }

  btnClick1(){
    this.router.navigate(['/students/class','edit',this.classId]);
  };
  getLoggedInUserName(): string {
    const user = this.service.getLoggedInUser();
    return user;
  }
}
