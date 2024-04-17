import { Component, OnInit } from '@angular/core';
import { teacher } from '../models/teacher.model';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css'
})
export class TeacherComponent implements OnInit{
  teachers:teacher[]=[];
  selectedRecords: Array<teacher> = [];
  constructor(private service:StudentService,private router:Router,private mat:MatDialog){}
  ngOnInit(): void{
    this.service.getAllTeachers().subscribe({
      next:(teachers)=>{
        this.teachers=teachers;
      }
    })
  }
  checkSelection(teacher: teacher): void {
    if (this.isSelected(teacher)) {
      this.selectedRecords = this.selectedRecords.filter(
        (selectedRecord) => selectedRecord.id !== teacher.id
      );
    } else {
      this.selectedRecords.push(teacher);
    }
  }
  isSelected(record: teacher): boolean {
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
      this.service.deleteTeacher(recordId.id).subscribe(
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
  deleteTeacher(id:number){
    this.service.deleteTeacher(id).subscribe({
      next:(course)=>{
        this.router.navigate(['students/teacher']);
      }
    });
  }
  deleteallrecords(){
    this.teachers.forEach(teacher=>{
      this.service.deleteUser(teacher.id).subscribe(
        ()=>{
  
        },error=>{
          console.error('Error deleting record:', error);
        }
      )
    })
  }
  btnClick(){
    this.router.navigateByUrl('students/teacher/addTeacher');
  };
  btnClick1(){
    this.router.navigateByUrl('students');
  };
  getLoggedInUserName(): string {
    const user = this.service.getLoggedInUser();
    return user;
  }
}
