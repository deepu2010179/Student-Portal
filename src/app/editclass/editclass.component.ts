import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student/student.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';
import { SharedService } from '../student/shared.service';
import { Class } from '../models/class.model';

@Component({
  selector: 'app-editclass',
  templateUrl: './editclass.component.html',
  styleUrl: './editclass.component.css'
})
export class EditclassComponent implements OnInit{
  formGrp:FormGroup; 
  constructor(private fb:FormBuilder,private route:ActivatedRoute,private service:StudentService,private router:Router,private mat:MatDialog,private dia:DialogComponent,private sh:SharedService){
    this.formGrp=fb.group({
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z ]+$")]]
    })
  }
  get mobno(){
    return this.formGrp.controls;
  }

  editClassrequest:Class={
    id: 0,
    course_id:0,
    name: '',
    session:'',
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  };
  @Input() classId!: number;
  public courseId:string|null='';
  ngOnInit(): void {
    this.sh.courseId$.subscribe(id => {
      this.courseId = id;
    });
    this.route.paramMap.subscribe({
      next:(params)=>{
        const id=params.get('id');
        if(id){
          this.sh.setClassId(id);
          this.service.getClass(id).subscribe({
            next:(response)=>{
              this.editClassrequest=response;
            }
          });
        }
      }
    })
    if(this.classId){
      this.sh.setClassId(this.classId.toString());
      this.service.getClass(this.classId.toString()).subscribe({
        next:(response)=>{
          this.editClassrequest=response;
        }
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
      this.updateclass();
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
  updateclass(){
    this.service.updateClass(this.editClassrequest.id,this.editClassrequest).subscribe({
      next:(response)=>{
        this.router.navigate(['/students/course','edit',this.courseId]);
      }
    });
  }

  btnClick1(){
    this.router.navigate(['/students/course','edit',this.courseId]);
  };
  getLoggedInUserName(): string {
    const user = this.service.getLoggedInUser();
    return user;
  }
}
