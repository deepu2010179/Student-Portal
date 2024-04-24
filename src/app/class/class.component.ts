import { Component, OnInit } from '@angular/core';
import { Class } from '../models/class.model';
import { StudentService } from '../student/student.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';
import { SharedService } from '../student/shared.service';
import { section } from '../models/section.model';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrl: './class.component.css'
})
export class ClassComponent implements OnInit{
  classes:Class[]=[];
  addClassrequest:Class={
    id:0,
    course_id:0,
    name:'',
    session:'',
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  }
  addClass(){
    this.addClassrequest.course_id=Number(this.courseid);
    this.service.addClass(this.addClassrequest).subscribe({
      next:(role:any)=>{
        this.router.navigate(['/students/course','edit',this.courseid]);
      }
    });
    this.refresh();
  }
  selectedRecords: Array<Class> = [];
  constructor(private service:StudentService,private router:Router,private mat:MatDialog,private sh:SharedService){}
  public courseid:string|null='';
  public classId:string|null='';
  ngOnInit(): void{
    // this.service.getAllClasses().subscribe({
    //   next:(classes)=>{
    //     this.classes=classes;
    //   }
    // })
    this.sh.courseId$.subscribe(id => {
      this.courseid=id;
      this.getByCourseId(id);
    });
    this.sh.classId$.subscribe(id => {
      this.classId = id;
    });
  }
  checkSelection(clas: Class): void {
    if (this.isSelected(clas)) {
      this.selectedRecords = this.selectedRecords.filter(
        (selectedRecord) => selectedRecord.id !== clas.id
      );
    } else {
      this.selectedRecords.push(clas);
    }
  }
  isSelected(record: Class): boolean {
    return this.selectedRecords.some((selectedRecord) => selectedRecord.id === record.id);
  }
  confirmDialog(): void {
    const message = `Are you sure you want to delete Records?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.mat.open(DialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
  
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult)
      this.deleteSelectedRecords();
    });
  }
  deleteSelectedRecords() {
    this.selectedRecords.forEach(recordId => {
      this.service.deleteClass(recordId.id).subscribe(
        () => {
        },
        error => {
          console.error('Error deleting record:', error);
        }
      );
    });
    this.refresh();
  }
  refresh(): void {
    window.location.reload();
  }
  deleteClass(id:number){
    this.service.deleteClass(id).subscribe({
      next:(course)=>{
        this.router.navigate(['students/class']);
      }
    });
  }
  deleteallrecords(){
    this.classes.forEach(clas=>{
      this.service.deleteSection(clas.id).subscribe(
        ()=>{
  
        },error=>{
          console.error('Error deleting record:', error);
        }
      )
    })
  }
  btnClick(){
    this.router.navigateByUrl('students/class/addClass');
  };
  btnClick1(){
    this.router.navigateByUrl('students/course');
  };
  getLoggedInUserName(): string {
    const user = this.service.getLoggedInUser();
    return user;
  }
  getByCourseId(id:string|null){
    this.service.getClassByCourseId(id).subscribe({
      next:(classes)=>{
        this.classes=classes;
      }
    })
  }
  openCustomDialog() {
    this.service.openDialog('Add Class', 'Name', 'Session')
      .then(result => {
        this.addClassrequest.name=result.input1;
        this.addClassrequest.session=result.input2;
        console.log('Dialog closed with result:', result.input1);
        this.addClass();
      })
      .catch(error => {
        console.log('Dialog error:', error);
      });
  }
}
