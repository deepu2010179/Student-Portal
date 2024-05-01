import { Component, OnInit,NgZone } from '@angular/core';
import { teacher } from '../models/teacher.model';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';
import { teacher1 } from '../models/teacher1.model';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef,GridApi,
  GridOptions,
  GridReadyEvent,
  createGrid } from 'ag-grid-community';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css'
})
export class TeacherComponent implements OnInit{
  teachers:teacher1[]=[];
  selectedRecords: Array<teacher1> = [];
  constructor(private ngZone:NgZone,private service:StudentService,private router:Router,private mat:MatDialog){}
  ngOnInit(): void{
    this.service.getAllTeachers().subscribe({
      next:(teachers)=>{
        this.teachers=teachers;
        this.rowData=teachers;
      }
    })
  }
  checkSelection(teacher: teacher1): void {
    if (this.isSelected(teacher)) {
      this.selectedRecords = this.selectedRecords.filter(
        (selectedRecord) => selectedRecord.id !== teacher.id
      );
    } else {
      this.selectedRecords.push(teacher);
    }
  }
  isSelected(record: teacher1): boolean {
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
    this.selectedRecordIds.forEach(recordId => {
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
  rowData:any=[];
columnDefs: ColDef[] = [
  { headerName: 'Name', field: 'name', sortable: true, filter: true,pinned: 'left'},
  { headerName: 'Email', field: 'email', sortable: true, filter: true,pinned: 'left' },
  { headerName: 'Mobile', field: 'mobile', sortable: true, filter: true,pinned: 'left' },
  { headerName: 'Course', field: 'courseName', sortable: true, filter: true },
  { headerName: 'Class', field: 'className', sortable: true, filter: true },
  { headerName: 'Section', field: 'sectionName', sortable: true, filter: true },
  { headerName: 'Subject', field: 'subjectName', sortable: true, filter: true},
  { field: "actions", headerName: "Actions", cellRenderer:  (params:any) => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fa fa-pencil"></i>';
    button.classList.add('but1','button1');
    button.title='Edit';
    this.ngZone.run(() => {
      button.addEventListener('click', () => {
        this.router.navigate(['/students/teacher','edit',params.node.data.id])
      });
    });
    return button;
  }}
];
  selectedRecordIds: teacher1[] = [];
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
