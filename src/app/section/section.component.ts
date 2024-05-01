import { Component, OnInit,NgZone } from '@angular/core';
import { section } from '../models/section.model';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../student/shared.service';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef,GridApi,
  GridOptions,
  GridReadyEvent,
  createGrid } from 'ag-grid-community';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent implements OnInit{
  sections:section[]=[];
  selectedRecords: Array<section> = [];
  constructor(private ngZone:NgZone,private service:StudentService,private router:Router,private mat:MatDialog,private sh:SharedService){}
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
    this.selectedRecordIds.forEach(recordId => {
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
        this.rowData=sections;
      }
    })
  }
  rowData:any=[];
columnDefs: ColDef[] = [
  { headerName: 'Name', field: 'name', sortable: true, filter: true,width:640},
  { field: "actions", headerName: "Actions",width:640, cellRenderer:  (params:any) => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fa fa-pencil"></i>';
    button.classList.add('but1','button1');
    button.title='Edit';
    this.ngZone.run(() => {
      button.addEventListener('click', () => {
        this.router.navigate(['/students/section','edit',params.node.data.id])
      });
    });
    return button;
  }}
];
  selectedRecordIds: section[] = [];
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
