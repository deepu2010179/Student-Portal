import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentComponent } from './student/student.component';
import { NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AddstudentComponent } from './addstudent/addstudent.component';
import { EditstudentComponent } from './editstudent/editstudent.component';
import { FooterComponent } from './footer/footer.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DialogComponent } from './dialog/dialog.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {NgxPaginationModule} from 'ngx-pagination';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SortPipe } from './pipe/sort.pipe';
import { LoginComponent } from './login/login.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { StudentpageComponent } from './studentpage/studentpage.component';
import { AdduserComponent } from './adduser/adduser.component';
import { UserComponent } from './user/user.component';
import { MsalModule, MsalInterceptor, MSAL_INTERCEPTOR_CONFIG,MsalRedirectComponent, MsalGuard } from '@azure/msal-angular';
import { BrowserCacheLocation, Configuration, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { LogoutComponent } from './logout/logout.component';
import { RoleComponent } from './role/role.component';
import { AddroleComponent } from './addrole/addrole.component';
import { CourseComponent } from './course/course.component';
import { AddcourseComponent } from './addcourse/addcourse.component';
import { EditcourseComponent } from './editcourse/editcourse.component';
import { TeacherComponent } from './teacher/teacher.component';
import { AddteacherComponent } from './addteacher/addteacher.component';
import { EditteacherComponent } from './editteacher/editteacher.component';
import { DialogcComponent } from './dialogc/dialogc.component';
import { ClassComponent } from './class/class.component';
import { AddclassComponent } from './addclass/addclass.component';
import { SectionComponent } from './section/section.component';
import { AddsectionComponent } from './addsection/addsection.component';
import { EditsectionComponent } from './editsection/editsection.component';
import { EditclassComponent } from './editclass/editclass.component';
import { SubjectComponent } from './subject/subject.component';
import { AddsubjectComponent } from './addsubject/addsubject.component';
import { EditsubjectComponent } from './editsubject/editsubject.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    AddstudentComponent,
    EditstudentComponent,
    FooterComponent,
    DialogComponent,
    SortPipe,
    LoginComponent,
    LandingpageComponent,
    StudentpageComponent,
    AdduserComponent,
    UserComponent,
    LogoutComponent,
    RoleComponent,
    AddroleComponent,
    CourseComponent,
    AddcourseComponent,
    EditcourseComponent,
    TeacherComponent,
    AddteacherComponent,
    EditteacherComponent,
    DialogcComponent,
    ClassComponent,
    AddclassComponent,
    SectionComponent,
    AddsectionComponent,
    EditsectionComponent,
    EditclassComponent,
    SubjectComponent,
    AddsubjectComponent,
    EditsubjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgFor,
    ReactiveFormsModule,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    AgGridModule,
    MatInputModule,
    MatDialogModule,
    NgxPaginationModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: 'abdd642a-d3bc-4dca-92fd-37af75d69cf3',
        authority: 'https://login.microsoftonline.com/3b447d9a-2427-44f4-ad0f-a87ec4c811a2',
        redirectUri: 'http://localhost:4200/',
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
      },
      // system: {
      //   loggerOptions: {
      //     loggerCallback(logLevel: any, message: string) {
      //       console.log(message);
      //     },
      //     logLevel: 3,
      //     piiLoggingEnabled: false
      //   },
      //   navigateFrameWait: 0,
      // }
    }), {
      interactionType: InteractionType.Popup,
      authRequest: {
        scopes: ['User.Read']
      }
    },{
      interactionType: InteractionType.Popup,
      protectedResourceMap: new Map<string,string[]>([ 
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
    ])
  })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },MsalGuard,
    provideClientHydration(),
    provideAnimationsAsync(),
    { provide: MAT_DIALOG_DATA, useValue: {} },
    {
      provide: MatDialogRef,
      useValue: {}
    },
    DialogComponent,
    StudentComponent,
    LoginComponent,
    EditcourseComponent
  ],
  bootstrap: [AppComponent,MsalRedirectComponent]
})
export class AppModule { }
