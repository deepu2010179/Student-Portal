import { Component, NgZone, OnInit } from '@angular/core';
import { StudentService } from '../student/student.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  constructor(
    private service:StudentService,
    private _ngZone:NgZone,
    private router:Router){}
 
  ngOnInit(): void {
     
  }
  public logout(){
    this.service.signOutExternal();
    this._ngZone.run(()=>{
      this.router.navigate(['/']).then(()=>window.location.reload());
    })
  }
}