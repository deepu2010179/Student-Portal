import { Component, OnInit,NgZone, ViewChild, ElementRef,AfterViewInit } from '@angular/core';
import { course } from '../models/course.model';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef,GridApi,
  GridOptions,
  GridReadyEvent,
  createGrid } from 'ag-grid-community';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit,AfterViewInit{
  courses:course[]=[];
  selectedRecords: Array<course> = [];
  constructor(private service:StudentService,private router:Router,private mat:MatDialog,private ngZone:NgZone){
    this.gridOptions = {} as GridOptions;
  }
  ngOnInit(): void{
    this.service.getAllCourses().subscribe({
      next:(courses)=>{
        this.courses=courses;
        this.rowData=courses;
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
    this.selectedRecordIds.forEach(recordId => {
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
  rowData:any=[];
columnDefs: ColDef[] = [
  { headerName: 'Name', field: 'name', sortable: true, filter: true,width:650},
  { field: "actions", headerName: "Actions", width:645,cellRenderer:  (params:any) => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fa fa-pencil"></i>';
    button.classList.add('but1','button1');
    button.title='Edit';
    this.ngZone.run(() => {
      button.addEventListener('click', () => {
        this.router.navigate(['/students/course','edit',params.node.data.id])
      });
    });
    return button;
  }}
];
  selectedRecordIds: course[] = [];
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
  @ViewChild('agrid') gridContainer!: ElementRef;
  gridOptions: GridOptions;
  ngAfterViewInit() {
    // this.updateColumnWidths();
  }
  updateColumnWidths() {
    if (this.gridContainer&& this.gridOptions&&this.gridOptions.api) {
      const containerWidth = this.gridContainer.nativeElement.offsetWidth;
      const columnCount = this.columnDefs.length;
      const columnWidth = containerWidth / columnCount;
      this.columnDefs.forEach(column => {
        column.width = columnWidth;
      });
        // this.gridOptions.api.setColumnDefs(this.columnDefs);
    }
  }
}
