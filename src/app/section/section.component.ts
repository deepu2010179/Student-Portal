import { Component, OnInit } from '@angular/core';
import { section } from '../models/section.model';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../student/shared.service';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent implements OnInit{
  sections:section[]=[];
  selectedRecords: Array<section> = [];
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
  checkSelection(section: section): void {
    if (this.isSelected(section)) {
      this.selectedRecords = this.selectedRecords.filter(
        (selectedRecord) => selectedRecord.id !== section.id
      );
    } else {
      this.selectedRecords.push(section);
    }
  }
  isSelected(record: section): boolean {
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
      this.service.deleteSection(recordId.id).subscribe(
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
    this.service.deleteSection(id).subscribe({
      next:(course)=>{
        this.router.navigate(['students/class']);
      }
    });
  }
  deleteallrecords(){
    this.sections.forEach(section=>{
      this.service.deleteSection(section.id).subscribe(
        ()=>{
  
        },error=>{
          console.error('Error deleting record:', error);
        }
      )
    })
  }
  btnClick(){
    this.router.navigateByUrl('students/section/addSection');
  };
  btnClick1(){
    this.router.navigate(['/students/course','edit',this.courseid]);
  };
  getLoggedInUserName(): string {
    const user = this.service.getLoggedInUser();
    return user;
  }
  getByClassId(id:string|null){
    this.service.getSectionByClassId(id).subscribe({
      next:(sections)=>{
        this.sections=sections;
      }
    })
  }
}
