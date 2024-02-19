import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { StudentService } from './student.service';
import { student } from '../models/student.model';
import { Router } from '@angular/router';
import { Console } from 'console';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent implements OnInit{
  students:student[]=[];
  maritals = ['0-Single','1-Married','2-Separated'];
  selectedRecords: Array<student> = [];
  state: any;
  constructor(private studentService: StudentService,private router:Router){
   
  }

  ngOnInit(): void{
    this.studentService.getAllRecords().subscribe({
      next:(students)=>{
        this.students=students;
      }
    })
  }

  checkSelection(student: student): void {
    if (this.isSelected(student)) {
      this.selectedRecords = this.selectedRecords.filter(
        (selectedRecord) => selectedRecord.id !== student.id
      );
    } else {
      this.selectedRecords.push(student);
    }
  }

  isSelected(record: student): boolean {
    return this.selectedRecords.some((selectedRecord) => selectedRecord.id === record.id);
  }
  refresh(): void {
    window.location.reload();
}
  deleteSelectedRecords() {
    this.selectedRecords.forEach(recordId => {
      this.studentService.deleteStudent(recordId.id).subscribe(
        () => {
          this.refresh();
        },
        error => {
          console.error('Error deleting record:', error);
        }
      );
    });
  }
  deleteStudent(id:number){
    this.studentService.deleteStudent(id).subscribe({
      next:(student)=>{
        this.router.navigate(['students']);
      }
    });
  }
}
