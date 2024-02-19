import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { AddstudentComponent } from './addstudent/addstudent.component';
import { EditstudentComponent } from './editstudent/editstudent.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
  path:'',
  component:StudentComponent
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
        }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
