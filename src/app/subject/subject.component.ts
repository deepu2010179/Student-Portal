import { Component} from '@angular/core';
import { subject } from '../models/subject.model';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { SharedService } from '../student/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';
import { ColDef,GridApi,
  GridOptions,
  GridReadyEvent,
  createGrid } from 'ag-grid-community';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.css'
})
export class SubjectComponent {
  subjects:subject[]=[];
  selectedRecords: Array<subject> = [];
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
    this.selectedRecordIds.forEach(recordId => {
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
        this.rowData=subjects;
      }
    })
  }
  rowData:any=[];
columnDefs: ColDef[] = [
  { headerName: 'SubjectCode', field: 'subjectCode', sortable: true, filter: true,width:320},
  { headerName: 'Name', field: 'name', sortable: true, filter: true,width:320},
  { headerName: 'TotalLectures', field: 'totalLectures', sortable: true, filter: true ,width:320},
  { field: "actions", headerName: "Actions",width:320, cellRenderer:  (params:any) => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fa fa-pencil"></i>';
    button.classList.add('but1','button1');
    button.title='Edit';
    this.ngZone.run(() => {
      button.addEventListener('click', () => {
        this.router.navigate(['/students/subject','edit',params.node.data.id])
      });
    });
    return button;
  }}
];
  selectedRecordIds: subject[] = [];
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
