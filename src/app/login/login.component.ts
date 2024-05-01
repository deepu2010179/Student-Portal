import { Component, Input, NgZone, OnInit } from '@angular/core';
import { StudentService } from '../student/student.service';
import { auth } from '../models/auth.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentComponent } from '../student/student.component';
import { CredentialResponse,PromptMomentNotification } from 'google-one-tap';
import { MsalService } from '@azure/msal-angular';
import { async, filter, takeUntil } from 'rxjs';
import { InteractionStatus } from '@azure/msal-browser';
import { SharedService } from '../student/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  data:any;
  res:any;
  nav:boolean=false;
  broadcastService: any;
  constructor(private formBuilder:FormBuilder, private authService:StudentService,private router:Router
    ,private stu:StudentComponent,private _ngZone:NgZone,private auth:MsalService,private sh:SharedService){}
  auths:auth={
    username:'',
    password:''
  };
  roles:string[]=[];
  ngOnInit(): void {
    this.setLoginDisplay();
    // @ts-ignore
    window.onGoogleLibraryLoad =()=>{
      // @ts-ignore
      google.accounts.id.initialize({
        client_id:'300057009724-c3unjkfe3ltfgguv2f5t5t93ojsakq6v.apps.googleusercontent.com',
        callback:this.handleCredentialResponse.bind(this),
        auto_select:false,
        cancel_on_tap_outside:true
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById("google"),
        {theme:"outline",size:"large",width:"100px"}
      );
      // @ts-ignore
      google.accounts.id.prompt((notification:PromptMomentNotification)=>{});
    };
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    this.ino();
  }
  async ino(){
    await this.auth.instance.initialize();
    // await this.auth.instance.handleRedirectPromise().then((res) => {
    //   if (res != null && res.account != null) {
    //     this.auth.instance.setActiveAccount(res.account);
    //   }
    // });
  }
  private _destroying$(_destroying$: any): any {
    throw new Error('Method not implemented.');
  }
  async handleCredentialResponse(response:CredentialResponse){
    await this.authService.LoginWithGoogle(response.credential).subscribe(
      (response:any)=>{
        this.authService.storeToken(response.token);
        this.data=response;
        this.res=this.data.role;
        this.sh.setRoles(this.res.result);
        this.sh.role$.subscribe(role => {
          this.roles = role;
        });
        this,this.authService.logedname=response.userName;
        this._ngZone.run(()=>{
          if(this.res.result.length>1)
          this.router.navigate(['students'])
          else{
            if(this.res.result[0]=="admin")
              this.router.navigate(['students']);
            else
            this.router.navigate(['students/studentpage']);
          }
        })
      },
      (error:any)=>{
        console.log(error);
      }
    );
  }

  get f() { return this.loginForm.controls; }
  loginDisplay = false;
  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.authService.login(email, password).subscribe(
      (response) => {
        if (response.success) {
          this.data=response.data;
          this.res=this.data.role;
          this.sh.setRoles(this.res);
          localStorage.setItem('token', response.token);
          // if(this.res.result[0]=="admin"){
          //   this.router.navigate(['students']);
          // }
          // else{
          //   this.router.navigate(['studentpage']);
          // }
          if(this.res.result.length>1)
          this.router.navigate(['students']);
          else{
            if(this.res.result[0]=="admin")
              this.router.navigate(['students']);
            else
            this.router.navigate(['students/studentpage']);
          }

        } else {
          this.errorMessage = response.message;
        }
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Please check your credentials.';
      }
    );
  }
  password: string = '';
  showPassword: boolean = false;

  togglePasswordVisibility(passwordInput: HTMLInputElement) {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }
  async handlemicro(result:any){
    await this.authService.LoginWithMicrosoft(result.accessToken).subscribe(
      (response)=>{
        this.data=response;
        this.res=this.data.role;
        this.sh.setRoles(this.res.result);
        localStorage.setItem('token', response.token);
        this,this.authService.logedname=response.userName;
        this._ngZone.run(()=>{
          if(this.res.result.length>1)
            this.router.navigate(['students']);
            else{
              if(this.res.result[0]=="admin")
                this.router.navigate(['students']);
              else
              this.router.navigate(['students/studentpage']);
            }
        })
      }
    );
  }
 async loginwithmicro() {
   await this.auth.loginPopup()
      .subscribe({
        next: (result) => {
          this.handlemicro(result);
        },
        error: (error) => console.log(error)
      });
  }
  setLoginDisplay() {
    this.loginDisplay = this.auth.instance.getAllAccounts().length > 0;
  }
  logout() { 
    this._ngZone.run(()=>{
      this.auth.logoutRedirect({
        postLogoutRedirectUri: 'http://localhost:4200/'
      });
    })
  }
  
}
