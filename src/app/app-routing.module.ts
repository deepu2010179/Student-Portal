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
import { RoleComponent } from './role/role.component';
import { AddroleComponent } from './addrole/addrole.component';
import { CourseComponent } from './course/course.component';
import { AddcourseComponent } from './addcourse/addcourse.component';
import { EditcourseComponent } from './editcourse/editcourse.component';
import { TeacherComponent } from './teacher/teacher.component';
import { AddteacherComponent } from './addteacher/addteacher.component';
import { EditteacherComponent } from './editteacher/editteacher.component';
import { AddclassComponent } from './addclass/addclass.component';
import { AddsectionComponent } from './addsection/addsection.component';
import { EditclassComponent } from './editclass/editclass.component';
import { ClassComponent } from './class/class.component';
import { EditsectionComponent } from './editsection/editsection.component';
import { AddsubjectComponent } from './addsubject/addsubject.component';
import { EditsubjectComponent } from './editsubject/editsubject.component';
import { TreeviewComponent } from './treeview/treeview.component';

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
    path:'students/role',
    component:RoleComponent
  },
  {
    path:'students/course',
    component:CourseComponent
  },
  {
    path:'students/teacher',
    component:TeacherComponent
  },
  {
    path:'students/class',
    component:ClassComponent
  },
  {
    path:'students/user/adduser',
    component:AdduserComponent
  },
  {
    path:'students/role/addRole',
    component:AddroleComponent
  },
  {
    path:'students/course/addCourse',
    component:AddcourseComponent
  },
  {
    path:'students/teacher/addTeacher',
    component:AddteacherComponent
  },
  {
    path:'students/class/addClass',
    component:AddclassComponent
  },
  {
    path:'students/section/addSection',
    component:AddsectionComponent
  },
  {
    path:'students/subject/addSubject',
    component:AddsubjectComponent
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
        },
        {
          path:'students/course/edit/:id',
          component:EditcourseComponent
          },
          {
            path:'students/class/edit/:id',
            component:EditclassComponent
            },
          {
            path:'students/teacher/edit/:id',
            component:EditteacherComponent
            },
            {
              path:'students/section/edit/:id',
              component:EditsectionComponent
              },
              {
                path:'students/subject/edit/:id',
                component:EditsubjectComponent
                },
                {
                  path:'students/course/treeview',
                  component:TreeviewComponent
                  },
        {
          path:'login',
          component:LoginComponent
          }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
