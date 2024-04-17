import { Component, OnInit } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { Router,NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  shouldShowNavBar: boolean = false;
  constructor(private login:LoginComponent,private router:Router){
  }
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.shouldShowNavBar = event.url.includes('students');
      }
    });
  }
  onclick(){
    this.router.navigate(['']).then(()=>window.location.reload());
    localStorage.removeItem('token');
    // this.login.logout();
  }
  refresh(): void {
    window.location.reload();
  }
}
