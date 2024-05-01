import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
import { user } from '../models/user.model';
import { user1 } from '../models/user1.model';
import { DialogComponent,ConfirmDialogModel } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as forge from 'node-forge';
import { ColDef,GridApi,
  GridOptions,
  GridReadyEvent,
  createGrid } from 'ag-grid-community';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  users:user1[]=[];
  selectedRecords: Array<user1> = [];
  constructor(private userservice:StudentService,private router:Router,private mat:MatDialog){}
  ngOnInit(): void{
    this.userservice.getAllUsers().subscribe({
      next:(users)=>{
        this.users=users;
        this.rowData=users;
      }
    })
  }
  private privateKey = `-----BEGIN RSA PRIVATE KEY-----
  MIICXAIBAAKBgQCtJ9/JAFG5kFJ30oTcTfXEX1Q502E5f2UK6SsxG7UOIKmT2CWI
  /Lm/WpKOcy5rsZ6dDrEyZZQ/AoQ/0Gv6531T4JpVQfVeVap79aoMRQlr603aI0Q3
  82FPMLctt28QMYCMKw64mxa4a6yB5/7RpMJRX/qbeRPFK0eYzV2I5XanDwIDAQAB
  AoGAS3rOOjhBZ7pZuJG0CLSTJX7IoExcXUwDJ7ZsdYO2cOocAa5+7i/8aEV7DU14
  Nsm+cogtBeLxtGXMcGTSLRUrs+TMpXJa4Q51IhUs7PbkeTLNxCkqD64AmKWm9LFK
  QKY5Fboy+OFnMzrVT1iSCuE1dNiPtDR+J6bhBJw5MVpyzkECQQDaolmLMqDMJHV8
  z3qIJos7vEPfh79e6Apy7thhazwsTD5rnljh78PU1ak0qR79ROoPMN5RKk8qP0v1
  1qqXfs57AkEAyr/CXznbNE1Qk9FNYmb/u8PZlvuMpveGNW80Ef3urymWMhARiyCa
  9dJh3Bz2FYdivsoN+6iwYpg4OGXXdiXvfQJAN7cZtJRRT9SWsBi7dAjGgJGIhmU0
  in39c66UK7dFHVDMs2Yl5mXQdOOB/C6A/C/cqcRdUzfB9tUsiViMHpEtEwJBAMkw
  mme2WNBAvGnCc2DnRnQDd8L8IWl6DGKv0+LaseR9hv5stYvysfKnbtZmosdgTlt2
  04NbtJRR6tAEN1eVc10CQCJ6+SjVpVcYI3VqnejcwaHBPkCjHzmz3PGqwJCox+Pw
  p+CyqCXt7P+M6jATM8mVype2COdrbxTKBX9uVgie04A=
  -----END RSA PRIVATE KEY-----`;
  decryptpass(password:string){
    var privateKey = forge.pki.privateKeyFromPem(this.privateKey);
    var encryptedData = window.atob(password);
    return privateKey.decrypt(encryptedData);
  }
  checkSelection(user: user1): void {
    if (this.isSelected(user)) {
      this.selectedRecords = this.selectedRecords.filter(
        (selectedRecord) => selectedRecord.id !== user.id
      );
    } else {
      this.selectedRecords.push(user);
    }
  }
  isSelected(record: user1): boolean {
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
      this.userservice.deleteUser(recordId.id).subscribe(
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
    this.userservice.deleteUser(id).subscribe({
      next:(user)=>{
        this.router.navigate(['students/user']);
      }
    });
  }
  deleteallrecords(){
    this.users.forEach(user=>{
      this.userservice.deleteUser(user.id).subscribe(
        ()=>{
  
        },error=>{
          console.error('Error deleting record:', error);
        }
      )
    })
  }
  btnClick(){
    this.router.navigateByUrl('students/user/adduser');
  };
  btnClick1(){
    this.router.navigateByUrl('students');
  };
  getLoggedInUserName(): string {
    const user = this.userservice.getLoggedInUser();
    return user;
  }
  rowData:any=[];
  columnDefs: ColDef[] = [
    { headerName: 'UserName', field: 'username', sortable: true, filter: true,width:500},
    { headerName: 'Email', field: 'email', sortable: true, filter: true,width:500},
    { headerName: 'Role(s)', field: 'role', sortable: true, filter: true,width:299 }
  ];
    selectedRecordIds: user1[] = [];
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
