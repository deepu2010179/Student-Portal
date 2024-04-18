import { Component } from '@angular/core';
import { subject } from '../models/subject.model';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { SharedService } from '../student/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.css'
})
export class SubjectComponent {
  subjects:subject[]=[];
  selectedRecords: Array<subject> = [];
  constructor(private service:StudentService,private router:Router,private mat:MatDialog,private sh:SharedService){}
  public classid:string|null='';
  public courseid:string|null='';
  ngOnInit(): void{
    // this.service.getAllClasses().subscribe({
    //   next:(classes)=>{
    //     this.classes=classes;
    //   }
    // })
    this.sh.classId$.subscribe(id => {
      this.classid=id;
      this.getByClassId(id);
    });
    this.sh.courseId$.subscribe(id => {
      this.courseid=id;
    });
  }
  checkSelection(subject: subject): void {
    if (this.isSelected(subject)) {
      this.selectedRecords = this.selectedRecords.filter(
        (selectedRecord) => selectedRecord.id !== subject.id
      );
    } else {
      this.selectedRecords.push(subject);
    }
  }
  isSelected(record: subject): boolean {
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
      this.service.deleteSubject(recordId.id).subscribe(
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
  deleteSection(id:number){
    this.service.deleteSubject(id).subscribe({
      next:(course)=>{
        this.router.navigate(['students/class']);
      }
    });
  }
  deleteallrecords(){
    this.subjects.forEach(subject=>{
      this.service.deleteSubject(subject.id).subscribe(
        ()=>{
  
        },error=>{
          console.error('Error deleting record:', error);
        }
      )
    })
  }
  btnClick(){
    this.router.navigateByUrl('students/subject/addSubject');
  };
  btnClick1(){
    this.router.navigate(['/students/course','edit',this.courseid]);
  };
  getLoggedInUserName(): string {
    const user = this.service.getLoggedInUser();
    return user;
  }
  getByClassId(id:string|null){
    this.service.getSubjectByClassId(id).subscribe({
      next:(subjects)=>{
        this.subjects=subjects;
      }
    })
  }
}
