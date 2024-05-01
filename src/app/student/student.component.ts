import { Component,NgZone,ElementRef,OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { StudentService } from './student.service';
import { student } from '../models/student.model';
import { Router } from '@angular/router';
import { Console, error } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent,ConfirmDialogModel } from '../dialog/dialog.component';
import { SortPipe } from '../pipe/sort.pipe';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef,GridApi,
  GridOptions,
  GridReadyEvent,
  createGrid } from 'ag-grid-community';

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
  constructor(private ngZone:NgZone,private studentService: StudentService,private router:Router,private mat:MatDialog,private dia:DialogComponent
    ){
   
  }
  selectedm:string='--Select Management--'
  logindata:any;
  ngOnInit(): void{
    this.studentService.getAllRecords().subscribe({
      next:(students)=>{
        this.studentss=students;
        this.rowData=students;
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
    this.selectedRecordIds.forEach(recordId => {
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
exportToExcel(): void {
  this.studentService.exportToExcel(this.studentss, 'Students', 'Sheet1');
}
btnClick1(){
  let id = this.selectedman?.nativeElement.value;
  if(id=='user')
    this.router.navigateByUrl('students/user');
  if(id=='role')
    this.router.navigateByUrl('students/role');
  if(id=='course')
    this.router.navigateByUrl('students/course');
  if(id=='teacher')
    this.router.navigateByUrl('students/teacher');
};
getLoggedInUserName(): string {
  const user = this.studentService.getLoggedInUser();
  return user;
}
rowData:any=[];
columnDefs: ColDef[] = [
  { headerName: 'Code', field: 'code', sortable: true, filter: true,pinned: 'left'},
  { headerName: 'Name', field: 'name', sortable: true, filter: true,pinned: 'left'},
  { headerName: 'Email', field: 'email', sortable: true, filter: true },
  { headerName: 'Mobile', field: 'mobile', sortable: true, filter: true },
  { headerName: 'Address1', field: 'address1', sortable: true, filter: true },
  { headerName: 'Address2', field: 'address2', sortable: true, filter: true },
  { headerName: 'State', field: 'stateName', sortable: true, filter: true },
  { headerName: 'City', field: 'cityName', sortable: true, filter: true },
  { headerName: 'Gender', field: 'genderName', sortable: true, filter: true },
  { headerName: 'Marital Status', field: 'maritalStatusName', sortable: true, filter: true },
  { headerName: 'Course', field: 'courseName', sortable: true, filter: true },
  { headerName: 'Class', field: 'className', sortable: true, filter: true },
  { headerName: 'Section', field: 'sectionName', sortable: true, filter: true },
  { field: "actions", headerName: "Actions", cellRenderer:  (params:any) => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fa fa-pencil"></i>';
    button.classList.add('but1','button1');
    button.title='Edit';
    this.ngZone.run(() => {
      button.addEventListener('click', () => {
        this.router.navigate(['/students','edit',params.node.data.id])
      });
    });
    return button;
  }}
];
  selectedRecordIds: student[] = [];
  gridApi!: GridApi;
  public paginationPageSize = 5;
  public paginationPageSizeSelector: number[] | boolean = [5, 10, 20,50,100];
  public rowSelection: "single" | "multiple" = "multiple";
  onSelectionChanged(): void {
    const selectedRows = this.gridApi.getSelectedRows();
    this.selectedRecordIds = selectedRows.map(row => row);
  }
  onGridReady(params:any): void {
    this.gridApi = params.api;
  }
}
