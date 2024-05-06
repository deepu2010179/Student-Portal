import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student/student.service';
import { SharedService } from '../student/shared.service';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { section } from '../models/section.model';

@Component({
  selector: 'app-editsection',
  templateUrl: './editsection.component.html',
  styleUrl: './editsection.component.css'
})
export class EditsectionComponent {
  formGrp:FormGroup; 
  constructor(private fb:FormBuilder,private route:ActivatedRoute,private service:StudentService,private router:Router,private mat:MatDialog,private dia:DialogComponent,private sh:SharedService){
    this.formGrp=fb.group({
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z ]+$")]]
    })
  }
  get mobno(){
    return this.formGrp.controls;
  }

  editSectionrequest:section={
    id: 0,
    class_id:0,
    name: '',
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  };
  public classId:string|null='';
  @Input() sectionId!: number;
  ngOnInit(): void {
    this.sh.classId$.subscribe(id => {
      this.classId = id;
    });
    this.route.paramMap.subscribe({
      next:(params)=>{
        const id=params.get('id');
        if(id){
          this.service.getSection(id).subscribe({
            next:(response)=>{
              this.editSectionrequest=response;
            }
          });
        }
      }
    })
    if(this.sectionId){
      this.service.getSection(this.sectionId.toString()).subscribe({
        next:(response)=>{
          this.editSectionrequest=response;
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
      this.updatesection();
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
  updatesection(){
    this.service.updateSection(this.editSectionrequest.id,this.editSectionrequest).subscribe({
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
