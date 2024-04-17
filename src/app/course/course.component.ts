import { Component, OnInit } from '@angular/core';
import { course } from '../models/course.model';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit{
  courses:course[]=[];
  selectedRecords: Array<course> = [];
  constructor(private service:StudentService,private router:Router,private mat:MatDialog){}
  ngOnInit(): void{
    this.service.getAllCourses().subscribe({
      next:(courses)=>{
        this.courses=courses;
      }
    })
  }
  checkSelection(course: course): void {
    if (this.isSelected(course)) {
      this.selectedRecords = this.selectedRecords.filter(
        (selectedRecord) => selectedRecord.id !== course.id
      );
    } else {
      this.selectedRecords.push(course);
    }
  }
  isSelected(record: course): boolean {
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
      this.service.deleteCourse(recordId.id).subscribe(
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
  deleteCourse(id:number){
    this.service.deleteCourse(id).subscribe({
      next:(course)=>{
        this.router.navigate(['students/teacher']);
      }
    });
  }
  deleteallrecords(){
    this.courses.forEach(course=>{
      this.service.deleteUser(course.id).subscribe(
        ()=>{
  
        },error=>{
          console.error('Error deleting record:', error);
        }
      )
    })
  }
  btnClick(){
    this.router.navigateByUrl('students/course/addCourse');
  };
  btnClick1(){
    this.router.navigateByUrl('students');
  };
  getLoggedInUserName(): string {
    const user = this.service.getLoggedInUser();
    return user;
  }
}
