import { Component, OnInit } from '@angular/core';
import { role } from '../models/role.model';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, DialogComponent } from '../dialog/dialog.component';
import { AgGridEvent, ColDef,GridApi,
  GridOptions,
  GridReadyEvent,
  createGrid } from 'ag-grid-community';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit {
  roles:role[]=[];
  selectedRecords: Array<role> = [];
  constructor(private roleservice:StudentService,private router:Router,private mat:MatDialog){}
  ngOnInit(): void{
    this.roleservice.getAllRoles().subscribe({
      next:(roles)=>{
        this.roles=roles;
        this.rowData=roles;
      }
    })
  }
  checkSelection(role: role): void {
    if (this.isSelected(role)) {
      this.selectedRecords = this.selectedRecords.filter(
        (selectedRecord) => selectedRecord.id !== role.id
      );
    } else {
      this.selectedRecords.push(role);
    }
  }
  isSelected(record: role): boolean {
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
      this.roleservice.deleteRole(recordId.id).subscribe(
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
  deleteUser(id:number){
    this.roleservice.deleteRole(id).subscribe({
      next:(user)=>{
        this.router.navigate(['students/user']);
      }
    });
  }
  deleteallrecords(){
    this.roles.forEach(role=>{
      this.roleservice.deleteUser(role.id).subscribe(
        ()=>{
  
        },error=>{
          console.error('Error deleting record:', error);
        }
      )
    })
  }
  btnClick(){
    this.router.navigateByUrl('students/role/addRole');
  };
  btnClick1(){
    this.router.navigateByUrl('students');
  };
  getLoggedInUserName(): string {
    const user = this.roleservice.getLoggedInUser();
    return user;
  }
  onSortChanged(e:any) {
    e.api.refreshCells();
  }
  rowData:any=[];
  columnDefs: ColDef[] = [
    { headerName: 'Role', field: 'role_name', sortable: true, filter: true,width:1296}
  ];
    selectedRecordIds: role[] = [];
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
