import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { AddstudentComponent } from './addstudent/addstudent.component';
import { EditstudentComponent } from './editstudent/editstudent.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { StudentpageComponent } from './studentpage/studentpage.component';
import { AdduserComponent } from './adduser/adduser.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path:'',
    component:LandingpageComponent
  },
  {
    path:'students/user',
    component:UserComponent
  },
  {
    path:'students/user/adduser',
    component:AdduserComponent
  },
  {
    path:'students/studentpage',
    component:StudentpageComponent
  },
  {
    path:'logout',
    component:LandingpageComponent
  },
  {
    path:'students/logout',
    component:LandingpageComponent
  },
  {
    path:'landing',
    component:LandingpageComponent
  },
  {
    path:'students',
    component:StudentComponent
    },
    {
      path:'students/#',
      component:AppComponent
      },
    {
      path:'students/add',
      component:AddstudentComponent
      },
      {
        path:'students/edit/:id',
        component:EditstudentComponent
        },{
          path:'login',
          component:LoginComponent
          }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
