import { ChangeDetectorRef, Component, OnInit, ViewChild,NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student/student.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';
import { teacher } from '../models/teacher.model';
import { teacher1 } from '../models/teacher1.model';
import { SharedService } from '../student/shared.service';
import { subject3 } from '../models/subject3.model';
import { teachersubject } from '../models/teachersubject.model';
import { course } from '../models/course.model';
import { Class } from '../models/class.model';
import { section } from '../models/section.model';
import { subject } from '../models/subject.model';
import { subject1 } from '../models/subject1.model';
import { subject2 } from '../models/subject2.model';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef,GridApi,
  GridOptions,
  GridReadyEvent,
  createGrid } from 'ag-grid-community';

@Component({
  selector: 'app-editteacher',
  templateUrl: './editteacher.component.html',
  styleUrl: './editteacher.component.css'
})
export class EditteacherComponent implements OnInit{
  formGrp:FormGroup; 
  subje:Array<subject3>=[];
  courses: Array<course>=[];
  classes: Array<Class>=[];
  sections: Array<section>=[];
  subjects: Array<subject>=[];
  subj:Array<subject1>=[];
  subj1:Array<subject1>=[];
  ind:number=-1;
  constructor(private ngZone:NgZone,private fb:FormBuilder,private route:ActivatedRoute,private service:StudentService,private router:Router,private mat:MatDialog,private dia:DialogComponent,private sh:SharedService){
    this.formGrp=fb.group({
      Name1:['',[Validators.required,Validators.pattern("^[A-Za-z ]+$")]]
    })
  }
  get mobno(){
    return this.formGrp.controls;
  }

  editTeacherrequest:teacher={
    id:0,
    name:'',
    email:'',
    mobile:'',
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  };
  addsubrequest:subject1={
    courseName:'',
    className:'',
    sectionName:'',
    name:''
  }
  addsubjectrequest:subject2={
    id:0,
    teacherId:0,
    courseId:0,
    classId:0,
    sectionId:0,
    subjectIds:'',
    isActive:true,
    createdBy: 0,
    createdOn: new Date(),
    modifiedBy: 0,
    modifiedOn: new Date()
  }
  public teacherId:string|null='';
  ngOnInit(): void {
    this.showadd=false;
    this.showadd1=true;
    this.service.getCourses().subscribe((courses: any) => {
      this.courses = courses;
    });
    this.ind=-1;
    this.route.paramMap.subscribe({
      next:(params)=>{
        const id=params.get('id');
        this.sh.setTeachId(id);
        if(id){
          this.service.getTeacher(id).subscribe({
            next:(response)=>{
              this.editTeacherrequest=response;
            }
          });
        }

      }
    })
    this.sh.teachId$.subscribe(id => {
      this.teacherId = id;
    });
    this.service.getSubjectById(this.teacherId).subscribe((data:any)=>{
      this.subje=data;
      this.rowData=data;
    })
  }
  addSubjects(){
    this.addsubjectrequest.teacherId=Number(this.teacherId);
    this.addsubjectrequest.subjectIds=this.checkedValues1.join(',');
    this.service.addTeacherSubjects(this.addsubjectrequest).subscribe((data)=>{
    })
    this.checkedValues1=[];
    this.refresh();
  }
  handleButtonClick() {
    this.addSubjects();
    this.addMoreSubjects();
}
  courseName(name:string){
    this.addsubrequest.courseName=name;
  }
  className(name:string){
    this.addsubrequest.className=name;
  }
  sectionName(name:string){
    this.addsubrequest.sectionName=name;
  }
  subjectName(name:string){
    this.addsubrequest.name=name;
  }
  sub:string='';
  checkedValues: string[] = [];
  checkedValues1: string[] = [];
  addsubjects:string='';
  addsubjects1:string[]=[];
  handleChange(event: any,name:string) {
    this.sub=event.target.value.toString();
    if (event.target.checked) {
      this.checkedValues.push(this.addsubjectrequest.courseId.toString());
      this.checkedValues.push(this.addsubjectrequest.classId.toString());
      this.checkedValues.push(this.addsubjectrequest.sectionId.toString());
      this.checkedValues.push(this.sub);
      this.checkedValues1.push(this.sub);
      this.addsubjects=this.checkedValues.join(',');
      this.checkedValues=[];
      if(!this.addsubjects1.includes(this.addsubjects)){
      this.addsubjects1.push(this.addsubjects);
      console.log(this.addsubjectrequest);
      }
      const newSubRequest: subject1 = {
        courseName: this.addsubrequest.courseName,
        className: this.addsubrequest.className,
        sectionName: this.addsubrequest.sectionName,
        name: name
      };
      this.subj1.push(newSubRequest);
      console.log(this.subj1)
    }if (!event.target.checked) {
      this.checkedValues.push(this.addsubjectrequest.courseId.toString());
      this.checkedValues.push(this.addsubjectrequest.classId.toString());
      this.checkedValues.push(this.addsubjectrequest.sectionId.toString());
      this.checkedValues.push(this.sub);
      this.checkedValues1.splice(this.checkedValues1.indexOf(this.sub),1);
      this.addsubjects=this.checkedValues.join(',');
      this.checkedValues=[];
      this.addsubjects1.splice(this.addsubjects1.indexOf(this.addsubjects),1);
      const indexToRemove = this.subj1.findIndex(sub => sub.courseName === this.addsubrequest.courseName &&
        sub.className === this.addsubrequest.className &&
        sub.sectionName === this.addsubrequest.sectionName &&
        sub.name === name);
        if(indexToRemove!=-1)
      this.subj1.splice(indexToRemove,1);
    }
  }
  showadd:boolean=false;
  showadd1:boolean=true;
  show(){
    this.showadd=true;
    this.showadd1=false;
  }
  addMoreSubjects() {
    this.subj1.forEach((value)=>{
      if(!this.subj.includes(value))
      this.subj.push(value);
    })
    // this.addsubjects1.forEach( (value) => {
    //   if(!this.addTeacherrequest.subjects.includes(value))
    //   this.addTeacherrequest.subjects.push(value);
    // });
    // this.addsubjectrequest.dataArray=this.addsubjects1.join(';');
    this.addsubjectrequest.courseId = 0;
    this.addsubjectrequest.classId = 0;
    this.addsubjectrequest.sectionId = 0;
}
selectedco:string='--Select Course--';
  selectedcl:string='--Select Class--';
  selectedse:string='--Select Section--';
  selectedRecords: Array<subject3> = [];
  onCourseChange(event:any) {
    let id =event.target.value;
    if (id) {
      this.service.getClassesByCourse(id).subscribe((classes: any) => {
        this.classes = classes;
      });
    } 
  }
  onClassChange(event:any) {
    let id =event.target.value;
    if (id) {
      this.service.getSectionsByClass(id).subscribe((sections: any) => {
        this.sections = sections;
      });
    } 
  }
  getsubject(event:any){
    let id =event.target.value;
    if(id){
      this.service.getSubjectByClassId(id).subscribe((subjects:any)=>{
        this.subjects=subjects;
      })
    }
  }
  checkSelection(subject: subject3): void {
    if (this.isSelected(subject)) {
      this.selectedRecords = this.selectedRecords.filter(
        (selectedRecord) => selectedRecord.id !== subject.id
      );
    } else {
      this.selectedRecords.push(subject);
    }
  }
  isSelected(record: subject3): boolean {
    return this.selectedRecords.some((selectedRecord) => selectedRecord.id === record.id);
  }
  confirmDialog1(): void {
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
      this.service.deleteSubjectById(recordId.id).subscribe(
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
  confirmDialog(): void {
    const message = `Are you sure you want to Edit ?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.mat.open(DialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
  
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult)
      this.updateteacher();
    });
  }
//   txt:boolean=false;
// conf(){
//   if (confirm("Are you sure ?")) {
//     this.txt = true;
//   } else {
//     this.txt = false;
//   }
//   if(this.txt)
//   this.updatestudent();
// }
  updateteacher(){
    this.service.updateTeacher(this.editTeacherrequest.id,this.editTeacherrequest).subscribe({
      next:(response)=>{
        this.router.navigate(['students/teacher']);
      }
    });
  }

  btnClick1(){
    this.router.navigateByUrl('students/teacher');
  };
  getLoggedInUserName(): string {
    const user = this.service.getLoggedInUser();
    return user;
  }
  rowData:any=[];
columnDefs: ColDef[] = [
  { headerName: 'Course', field: 'courseName', sortable: true, filter: true,width:300 },
  { headerName: 'Class', field: 'className', sortable: true, filter: true,width:300 },
  { headerName: 'Section', field: 'sectionName', sortable: true, filter: true,width:300 },
  { headerName: 'Subject', field: 'subjectName', sortable: true, filter: true,width:398 }
];
  selectedRecordIds: subject3[] = [];
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
