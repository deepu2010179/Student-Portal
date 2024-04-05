import { Component,ElementRef,OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { StudentService } from './student.service';
import { student } from '../models/student.model';
import { Router } from '@angular/router';
import { Console, error } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent,ConfirmDialogModel } from '../dialog/dialog.component';
import { SortPipe } from '../pipe/sort.pipe';

@Component({
  selector: '[app-student]',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})

export class StudentComponent implements OnInit{
  stu:any;
  total:number=0;
  totalpages:number=0;
  students:student[]=[];
  studentss:student[]=[];
  showmessage = false;
  maritals = ['0-Single','1-Married','2-Separated'];
  selectedRecords: Array<student> = [];
  state: any;
  name:any;
  constructor(private studentService: StudentService,private router:Router,private mat:MatDialog,private dia:DialogComponent
    ){
   
  }
  selectedm:string='--Select Management--'
  logindata:any;
  ngOnInit(): void{
    this.studentService.getAllRecords().subscribe({
      next:(students)=>{
        this.studentss=students;
      }
    })
    this.loadPaginatedData();
  }
  p:number=1;
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

// txt:boolean=false;
// conf(){
//   this.confirmDialog();
//   if (this.result) {
//     this.deleteSelectedRecords();
//   }
// }

btnClick(){
  this.router.navigateByUrl('students/add');
};
deleteallrecords(){
  this.students.forEach(student=>{
    this.studentService.deleteStudent(student.id).subscribe(
      ()=>{

      },error=>{
        console.error('Error deleting record:', error);
      }
    )
  })
}
  deleteSelectedRecords() {
    this.showmessage = false;
    this.selectedRecords.forEach(recordId => {
      this.studentService.deleteStudent(recordId.id).subscribe(
        () => {
        },
        error => {
          console.error('Error deleting record:', error);
        }
      );
    });
    this.showmessage=true;
    this.refresh();
  }
  deleteStudent(id:number){
    this.studentService.deleteStudent(id).subscribe({
      next:(student)=>{
        this.router.navigate(['students']);
      }
    });
  }
  // opendialog(){
  //   this.mat.open(DialogComponent,{
  //     width:'350px',
  //   })
  // }
  currentPage:number = 1;
  pageSize:number = 5;

  getsn(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
loadPaginatedData(): void {
  this.studentService.getPages(this.currentPage, this.pageSize).subscribe(data => {
      this.stu = data;
      this.students=this.stu.items;
      this.total=this.stu.totalRecords;
      this.totalpages=Math.ceil(this.total / this.pageSize);
  });
}
@ViewChild('pagesize') selectedpage :ElementRef |undefined;
@ViewChild('management') selectedman :ElementRef |undefined;
onPageSizeChange(){
  let id = this.selectedpage?.nativeElement.value;
  this.pageSize=id;
  // this.loadPaginatedData();
  this.onPageChange(1);
}
onPageChange(page: number): void {
  this.currentPage = page;
  this.loadPaginatedData();
}
search(){
  if(this.name==""){
      this.ngOnInit();
  }
  else{
    this.students=this.studentss.filter(res=>{
      return res.name.toLocaleLowerCase().match(this.name.toLocaleLowerCase());
    })
  }
}
//----------------------------------------sorting-------------------------------------
sortBy: string = '';
sortAsc: boolean = true;
clicked:boolean = false;
toggleSort(column: string) {
  this.clicked=true;
  if (this.sortBy === column) {
    this.sortAsc = !this.sortAsc;
  } else {
    this.sortAsc = true;
    this.sortBy = column;
  }
  this.students.sort((a:any, b:any) => {
    const order = this.sortAsc ? 1 : -1;
    return a[column].localeCompare(b[column]) * order;
  });
}
// sortByName(){
//   this.students.reverse();
// }
// sortByState() {
//   this.students.sort((a, b) => a.stateName.localeCompare(b.stateName));
// }
// sortByState(){
//   this.students.reverse();
// }
exportToExcel(): void {
  this.studentService.exportToExcel(this.studentss, 'Students', 'Sheet1');
}
btnClick1(){
  let id = this.selectedman?.nativeElement.value;
  if(id=='user')
  this.router.navigateByUrl('students/user');
};
getLoggedInUserName(): string {
  const user = this.studentService.getLoggedInUser();
  return user;
}
}
