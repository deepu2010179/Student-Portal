import { Component, Input, NgZone, OnInit } from '@angular/core';
import { StudentService } from '../student/student.service';
import { auth } from '../models/auth.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentComponent } from '../student/student.component';
import { CredentialResponse,PromptMomentNotification } from 'google-one-tap';

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
  constructor(private formBuilder:FormBuilder, private authService:StudentService,private router:Router
    ,private stu:StudentComponent,private _ngZone:NgZone){}
  auths:auth={
    username:'',
    password:''
  };

  ngOnInit(): void {
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
  }
  async handleCredentialResponse(response:CredentialResponse){
    await this.authService.LoginWithGoogle(response.credential).subscribe(
      (response:any)=>{
        this.authService.storeToken(response.token);
        this._ngZone.run(()=>{
          this.router.navigate(['students'])
        })
      },
      (error:any)=>{
        console.log(error);
      }
    );
  }
  // login1(): void {
  //   if (this.authService.authenticate(this.auths.username, this.auths.password)) {
  //     this.router.navigate(['students']);
  //   } else {
  //     console.log('Invalid credentials');
  //   }
  // }
  get f() { return this.loginForm.controls; }
 
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
}
