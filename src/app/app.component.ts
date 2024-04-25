import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { Router,NavigationEnd } from '@angular/router';
import { SharedService } from './student/shared.service';
import { StudentService } from './student/student.service';
import { role } from './models/role.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  shouldShowNavBar: boolean = false;
  shouldShowNavBar2:boolean = false;
  constructor(private login:LoginComponent,private router:Router,private sh:SharedService,private ss:StudentService){
  }
  role:string[]=[];
  roles:role[]=[];
  ngOnInit(): void {
    // this.ss.getAllRoles().subscribe({
    //   next:(roles)=>{
    //     this.roles=roles;
    //   }
    // })
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.shouldShowNavBar = event.url.includes('students');
        this.shouldShowNavBar2 = this.sh.roles.includes('admin');
        localStorage.setItem('a',JSON.stringify(this.shouldShowNavBar));
        localStorage.setItem('b',JSON.stringify(this.shouldShowNavBar2));
      }
    });
  }
  onclick(){
    this.router.navigate(['']).then(()=>window.location.reload());
    localStorage.removeItem('token');
    localStorage.removeItem('a');
    localStorage.removeItem('b');
    // this.login.logout();
  }
  refresh(): void {
    window.location.reload();
  }
  @ViewChild('management') selectedman :ElementRef |undefined;
  @ViewChild('role') selectedrle :ElementRef |undefined;
  selectedm:string='--Select Management--'
  selectedr:string='Sign in as'
  btnClick1(){
    let id = this.selectedman?.nativeElement.value;
    if(id=='user')
      this.router.navigateByUrl('students/user');
    if(id=='student')
      this.router.navigateByUrl('students');
    if(id=='role')
      this.router.navigateByUrl('students/role');
    if(id=='course')
      this.router.navigateByUrl('students/course');
    if(id=='teacher')
      this.router.navigateByUrl('students/teacher');
  };
  btnClick2(){
    let role = this.selectedrle?.nativeElement.value;
    if(role=='admin')
      this.router.navigateByUrl('students');
    if(role=='student')
      this.router.navigateByUrl('students/studentpage');
  }
  a(){
    return !!localStorage.getItem('a')
  }
  b(){
    return !!localStorage.getItem('b')
  }
}
