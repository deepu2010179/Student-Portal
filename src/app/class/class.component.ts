import { Component, OnInit ,NgZone} from '@angular/core';
import { Class } from '../models/class.model';
import { StudentService } from '../student/student.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';
import { SharedService } from '../student/shared.service';
import { section } from '../models/section.model';
import { ColDef,GridApi,
  GridOptions,
  GridReadyEvent,
  createGrid } from 'ag-grid-community';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrl: './class.component.css'
})
export class ClassComponent implements OnInit{
  classes:Class[]=[];
  addClassrequest:Class={
    id:0,
    course_id:0,
    name:'',
    session:'',
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  }
  addClass(){
    this.addClassrequest.course_id=Number(this.courseid);
    this.service.addClass(this.addClassrequest).subscribe({
      next:(role:any)=>{
        this.router.navigate(['/students/course','edit',this.courseid]);
      }
    });
    this.refresh();
  }
  selectedRecords: Array<Class> = [];
  constructor(private ngZone:NgZone,private service:StudentService,private router:Router,private mat:MatDialog,private sh:SharedService){}
  public courseid:string|null='';
  public classId:string|null='';
  ngOnInit(): void{
    // this.service.getAllClasses().subscribe({
    //   next:(classes)=>{
    //     this.classes=classes;
    //   }
    // })
    this.sh.courseId$.subscribe(id => {
      this.courseid=id;
      this.getByCourseId(id);
    });
    this.sh.classId$.subscribe(id => {
      this.classId = id;
    });
  }
  checkSelection(clas: Class): void {
    if (this.isSelected(clas)) {
      this.selectedRecords = this.selectedRecords.filter(
        (selectedRecord) => selectedRecord.id !== clas.id
      );
    } else {
      this.selectedRecords.push(clas);
    }
  }
  isSelected(record: Class): boolean {
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
      this.service.deleteClass(recordId.id).subscribe(
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
  deleteClass(id:number){
    this.service.deleteClass(id).subscribe({
      next:(course)=>{
        this.router.navigate(['students/class']);
      }
    });
  }
  deleteallrecords(){
    this.classes.forEach(clas=>{
      this.service.deleteSection(clas.id).subscribe(
        ()=>{
  
        },error=>{
          console.error('Error deleting record:', error);
        }
      )
    })
  }
  btnClick(){
    this.router.navigateByUrl('students/class/addClass');
  };
  btnClick1(){
    this.router.navigateByUrl('students/course');
  };
  getLoggedInUserName(): string {
    const user = this.service.getLoggedInUser();
    return user;
  }
  getByCourseId(id:string|null){
    this.service.getClassByCourseId(id).subscribe({
      next:(classes)=>{
        this.classes=classes;
        this.rowData=classes;
      }
    })
  }
  openCustomDialog() {
    this.service.openDialog('Add Class', 'Name', 'Session')
      .then(result => {
        this.addClassrequest.name=result.input1;
        this.addClassrequest.session=result.input2;
        console.log('Dialog closed with result:', result.input1);
        this.addClass();
      })
      .catch(error => {
        console.log('Dialog error:', error);
      });
  }
  rowData:any=[];
columnDefs: ColDef[] = [
  { headerName: 'Name', field: 'name', sortable: true, filter: true,width:450},
  { headerName: 'Session', field: 'session', sortable: true, filter: true,width:450 },
  { field: "actions", headerName: "Actions",width:398, cellRenderer:  (params:any) => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fa fa-pencil"></i>';
    button.classList.add('but1','button1');
    button.title='Edit';
    this.ngZone.run(() => {
      button.addEventListener('click', () => {
        this.router.navigate(['/students/class','edit',params.node.data.id]);
      });
    });
    return button;
  }}
];
  selectedRecordIds: Class[] = [];
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
