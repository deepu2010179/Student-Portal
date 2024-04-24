import { Injectable,ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable,of } from 'rxjs';
import { student } from '../models/student.model';
import { student1 } from '../models/student1.model';
import { state } from '../models/state.model';
import { city } from '../models/city.model';
import { environment } from '../../environments/environment';
import * as XLSX from 'xlsx';
import { catchError, map } from 'rxjs/operators';
import { user } from '../models/user.model';
import { user1 } from '../models/user1.model';
import { userrole } from '../models/userrole.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import CryptoJS from 'crypto-js';
import * as forge from 'node-forge';
import { role } from '../models/role.model';
import { course } from '../models/course.model';
import { teacher } from '../models/teacher.model';
import { Class } from '../models/class.model';
import { section } from '../models/section.model';
import { subject } from '../models/subject.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogcComponent } from '../dialogc/dialogc.component';
import { teacher1 } from '../models/teacher1.model';
import { teacher2 } from '../models/teacher2.model';
 
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  @ViewChild('st') stu: ElementRef | undefined;
  private apiKey = 'DeepanshuApiFetch@20112001';
  generateId(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth()+1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const second = currentDate.getSeconds().toString().padStart(2, '0');
    const msecond = currentDate.getMilliseconds().toString().padStart(2, '0');
    const id = `${year}${month}${day}`;
    return id;
  }
  baseApiUrl:string = 'https://localhost:7069';
  constructor(private http: HttpClient,private dialog: MatDialog) { }

  
 getAllRecords():Observable<student[]>{
  const headers = this.getHeaders();
  return this.http.get<student[]>(this.baseApiUrl+'/api/Student/query',{headers});
 }
 
 getAllUsers():Observable<user1[]>{
  const headers = this.getHeaders();
  return this.http.get<user1[]>(this.baseApiUrl+'/api/Users/users',{headers});
 }
 getAllRoles():Observable<role[]>{
  const headers = this.getHeaders();
  return this.http.get<role[]>(this.baseApiUrl+'/api/Role/roles',{headers});
 }
 getAllCourses():Observable<course[]>{
  const headers = this.getHeaders();
  return this.http.get<course[]>(this.baseApiUrl+'/api/Course/courses',{headers});
 }
 getAllTeachers():Observable<teacher1[]>{
  const headers = this.getHeaders();
  return this.http.get<teacher1[]>(this.baseApiUrl+'/api/Teacher/teachers',{headers});
 }
 getAllClasses():Observable<Class[]>{
  const headers = this.getHeaders();
  return this.http.get<Class[]>(this.baseApiUrl+'/api/Class/classes',{headers});
 }
 getAllSections():Observable<section[]>{
  const headers = this.getHeaders();
  return this.http.get<section[]>(this.baseApiUrl+'/api/Section/sections',{headers});
 }
 getAllSubjects():Observable<subject[]>{
  const headers = this.getHeaders();
  return this.http.get<subject[]>(this.baseApiUrl+'/api/Subject/subjects',{headers});
 }
 
 addStudent(addStudentrequest1:student1): Observable<student1>{
  const headers = this.getHeaders();
  addStudentrequest1.id=0;
  const currentDateAndTime: Date = new Date();
  addStudentrequest1.code=this.generateId();
  addStudentrequest1.createdBy= 1;
  addStudentrequest1.createdOn = currentDateAndTime;
  addStudentrequest1.modifiedBy = 1;
  addStudentrequest1.modifiedOn = currentDateAndTime;
  return this.http.post<student1>(this.baseApiUrl+'/api/Student',addStudentrequest1,{headers});
 }
private publicKey =`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCtJ9/JAFG5kFJ30oTcTfXEX1Q502E
5f2UK6SsxG7UOIKmT2CWI/Lm/WpKOcy5rsZ6dDrEyZZQ/AoQ/0Gv6531T4JpVQfVeVa
p79aoMRQlr603aI0Q382FPMLctt28QMYCMKw64mxa4a6yB5/7RpMJRX/qbeRPFK0eYz
V2I5XanDwIDAQAB
-----END PUBLIC KEY-----`;
// async encryptPassword(password: string): Promise<string> {
//   const publicKeyPem = forge.pki.publicKeyFromPem(this.publicKey);
//     const encrypted = publicKeyPem.encrypt(password, 'RSA-OAEP');
//     return forge.util.encode64(encrypted);
// }
addUser(addUserrequest: user): Observable<user> {
  const headers = this.getHeaders();
  var rsa = forge.pki.publicKeyFromPem(this.publicKey);
  var encrypted = window.btoa(rsa.encrypt(addUserrequest.hashed_password));
  return new Observable((observer) => {
    // this.encryptPassword(addUserrequest.hashed_password).then((hashedPassword) => {
      addUserrequest.hashed_password = encrypted;
      addUserrequest.id = 0;
      addUserrequest.security_question_id = 5;
      addUserrequest.answer_id = 5;
      addUserrequest.isLocked = true;
      this.http.post<user>(this.baseApiUrl + '/api/Users/addNewUser', addUserrequest, { headers })
        .subscribe(
          (response) => {
            observer.next(response);
            observer.complete(); 
          },
          (error) => {
            observer.error(error);
          }
        );
    });
}
addRole(addRolerequest: role): Observable<role> {
  const headers = this.getHeaders();
  return new Observable((observer) => {
      addRolerequest.id = 0;
      this.http.post<role>(this.baseApiUrl + '/api/Role/addNewRole', addRolerequest, { headers })
        .subscribe(
          (response) => {
            observer.next(response);
            observer.complete(); 
          },
          (error) => {
            observer.error(error);
          }
        );
    });
}
addCourse(addCourserequest:course): Observable<course>{
  const headers = this.getHeaders();
  addCourserequest.id=0;
  const currentDateAndTime: Date = new Date();
  addCourserequest.createdBy= 1;
  addCourserequest.createdOn = currentDateAndTime;
  addCourserequest.modifiedBy = 1;
  addCourserequest.isActive = true;
  addCourserequest.modifiedOn = currentDateAndTime;
  return this.http.post<course>(this.baseApiUrl+'/api/Course/addNewCourse',addCourserequest,{headers});
 }
 addTeacher(addTeacherrequest:teacher): Observable<teacher>{
  const headers = this.getHeaders();
  addTeacherrequest.id=0;
  const currentDateAndTime: Date = new Date();
  addTeacherrequest.createdBy= 1;
  addTeacherrequest.createdOn = currentDateAndTime;
  addTeacherrequest.modifiedBy = 1;
  addTeacherrequest.isActive = true;
  addTeacherrequest.modifiedOn = currentDateAndTime;
  return this.http.post<teacher>(this.baseApiUrl+'/api/Teacher/addNewTeacher',addTeacherrequest,{headers});
 }
 addClass(addClassrequest:Class): Observable<Class>{
  const headers = this.getHeaders();
  addClassrequest.id=0;
  const currentDateAndTime: Date = new Date();
  addClassrequest.createdBy= 1;
  addClassrequest.createdOn = currentDateAndTime;
  addClassrequest.modifiedBy = 1;
  addClassrequest.isActive = true;
  addClassrequest.modifiedOn = currentDateAndTime;
  return this.http.post<Class>(this.baseApiUrl+'/api/Class/addNewClass',addClassrequest,{headers});
 }
 addSection(addSectionrequest:section): Observable<section>{
  const headers = this.getHeaders();
  addSectionrequest.id=0;
  const currentDateAndTime: Date = new Date();
  addSectionrequest.createdBy= 1;
  addSectionrequest.createdOn = currentDateAndTime;
  addSectionrequest.modifiedBy = 1;
  addSectionrequest.isActive = true;
  addSectionrequest.modifiedOn = currentDateAndTime;
  return this.http.post<section>(this.baseApiUrl+'/api/Section/addNewSection',addSectionrequest,{headers});
 }
 addSubject(addSubjectrequest:subject): Observable<subject>{
  const headers = this.getHeaders();
  addSubjectrequest.id=0;
  const currentDateAndTime: Date = new Date();
  addSubjectrequest.createdBy= 1;
  addSubjectrequest.createdOn = currentDateAndTime;
  addSubjectrequest.modifiedBy = 1;
  addSubjectrequest.isActive = true;
  addSubjectrequest.modifiedOn = currentDateAndTime;
  return this.http.post<subject>(this.baseApiUrl+'/api/Subject/addNewSubject',addSubjectrequest,{headers});
 }
getHeaders() {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }).set('Api_Key', this.apiKey);
  }
 getStudent(id:string):Observable<student1>{
  const headers = this.getHeaders();
  return this.http.get<student1>(this.baseApiUrl+'/api/Student/'+id,{headers});
 }
 getCourse(id:string):Observable<course>{
  const headers = this.getHeaders();
  return this.http.get<course>(this.baseApiUrl+'/api/Course/'+id,{headers});
 }
 getTeacher(id:string):Observable<teacher1>{
  const headers = this.getHeaders();
  return this.http.get<teacher1>(this.baseApiUrl+'/api/Teacher/'+id,{headers});
 }
 getClass(id:string):Observable<Class>{
  const headers = this.getHeaders();
  return this.http.get<Class>(this.baseApiUrl+'/api/Class/'+id,{headers});
 }
 getSection(id:string):Observable<section>{
  const headers = this.getHeaders();
  return this.http.get<section>(this.baseApiUrl+'/api/Section/'+id,{headers});
 }
 getSubject(id:string):Observable<subject>{
  const headers = this.getHeaders();
  return this.http.get<subject>(this.baseApiUrl+'/api/Subject/'+id,{headers});
 }
 getClassByCourseId(id:string|null):Observable<Class[]>{
  const headers = this.getHeaders();
  return this.http.get<Class[]>(this.baseApiUrl+'/api/Class/courseid/'+id,{headers});
 }
 getSectionByClassId(id:string|null):Observable<section[]>{
  const headers = this.getHeaders();
  return this.http.get<section[]>(this.baseApiUrl+'/api/Section/classid/'+id,{headers});
 }
 getSubjectByClassId(id:string|null):Observable<subject[]>{
  const headers = this.getHeaders();
  return this.http.get<subject[]>(this.baseApiUrl+'/api/Subject/classid/'+id,{headers});
 }
 updateStudent(id:number,updateStudentRequest:student1):Observable<student1>{
  const headers = this.getHeaders();
  const currentDateAndTime: Date = new Date();
  updateStudentRequest.modifiedOn = currentDateAndTime;
  return this.http.put<student1>(this.baseApiUrl+'/api/Student/'+id,updateStudentRequest,{headers});
}
updateCourse(id:number,updateCourseRequest:course):Observable<course>{
  const headers = this.getHeaders();
  const currentDateAndTime: Date = new Date();
  updateCourseRequest.modifiedOn = currentDateAndTime;
  return this.http.put<course>(this.baseApiUrl+'/api/Course/'+id,updateCourseRequest,{headers});
}
updateTeacher(id:number,updateTeacherRequest:teacher1):Observable<teacher>{
  const headers = this.getHeaders();
  const currentDateAndTime: Date = new Date();
  return this.http.put<teacher>(this.baseApiUrl+'/api/Teacher/'+id,updateTeacherRequest,{headers});
}
updateClass(id:number,updateClassRequest:course):Observable<Class>{
  const headers = this.getHeaders();
  const currentDateAndTime: Date = new Date();
  updateClassRequest.modifiedOn = currentDateAndTime;
  return this.http.put<Class>(this.baseApiUrl+'/api/Class/'+id,updateClassRequest,{headers});
}
updateSection(id:number,updateSectionRequest:section):Observable<section>{
  const headers = this.getHeaders();
  const currentDateAndTime: Date = new Date();
  updateSectionRequest.modifiedOn = currentDateAndTime;
  return this.http.put<section>(this.baseApiUrl+'/api/Section/'+id,updateSectionRequest,{headers});
}
updateSubject(id:number,updateSubjectRequest:subject):Observable<subject>{
  const headers = this.getHeaders();
  const currentDateAndTime: Date = new Date();
  updateSubjectRequest.modifiedOn = currentDateAndTime;
  return this.http.put<subject>(this.baseApiUrl+'/api/Subject/'+id,updateSubjectRequest,{headers});
}
deleteStudent(id:number):Observable<student1>{
  const headers = this.getHeaders();
  return this.http.delete<student1>(this.baseApiUrl+'/api/Student/'+id,{headers});
}
deleteUser(id:number):Observable<user1>{
  const headers = this.getHeaders();
  return this.http.delete<user1>(this.baseApiUrl+'/api/Users/'+id,{headers});
}
deleteRole(id:number):Observable<role>{
  const headers = this.getHeaders();
  return this.http.delete<role>(this.baseApiUrl+'/api/Role/'+id,{headers});
}
deleteCourse(id:number):Observable<course>{
  const headers = this.getHeaders();
  return this.http.delete<course>(this.baseApiUrl+'/api/Course/'+id,{headers});
}
deleteTeacher(id:number):Observable<teacher2>{
  const headers = this.getHeaders();
  return this.http.delete<teacher2>(this.baseApiUrl+'/api/Teacher/'+id,{headers});
}
deleteClass(id:number):Observable<Class>{
  const headers = this.getHeaders();
  return this.http.delete<Class>(this.baseApiUrl+'/api/Class/'+id,{headers});
}
deleteSection(id:number):Observable<section>{
  const headers = this.getHeaders();
  return this.http.delete<section>(this.baseApiUrl+'/api/Section/'+id,{headers});
}
deleteSubject(id:number):Observable<subject>{
  const headers = this.getHeaders();
  return this.http.delete<subject>(this.baseApiUrl+'/api/Subject/'+id,{headers});
}
getStates(): Observable<state> {
  const headers = this.getHeaders();
  return this.http.get<state>(this.baseApiUrl+'/api/Student',{headers});
}
getCourses(): Observable<course> {
  const headers = this.getHeaders();
  return this.http.get<course>(this.baseApiUrl+'/api/Student/GetCourses',{headers});
}
getClassesByCourse(courseId:number): Observable<Class> {
  const headers = this.getHeaders();
  return this.http.get<Class>(this.baseApiUrl+'/api/Student/GetClasses/'+courseId,{headers});
}
getSectionsByClass(classId:number): Observable<section> {
  const headers = this.getHeaders();
  return this.http.get<section>(this.baseApiUrl+'/api/Student/GetSections/'+classId,{headers});
}
getCitiesByState(stateId: number): Observable<city> {
  const headers = this.getHeaders();
  return this.http.get<city>(this.baseApiUrl+'/api/Student/state/'+stateId,{headers});
}
checkemail(email:string):Observable<boolean>{
  const headers = this.getHeaders();
 return this.http.get<boolean>(this.baseApiUrl+'/api/Student/checke/'+email,{headers});
}
checkmobile(mobile:string):Observable<boolean>{
  const headers = this.getHeaders();
  return this.http.get<boolean>(this.baseApiUrl+'/api/Student/checkm/'+mobile,{headers});
}
checkemailt(email:string):Observable<boolean>{
  const headers = this.getHeaders();
 return this.http.get<boolean>(this.baseApiUrl+'/api/Teacher/checke/'+email,{headers});
}
checkmobilet(mobile:string):Observable<boolean>{
  const headers = this.getHeaders();
  return this.http.get<boolean>(this.baseApiUrl+'/api/Teacher/checkm/'+mobile,{headers});
}
getPages(pageNo:number,pageSize:number){
  const headers = this.getHeaders();
  return this.http.get(this.baseApiUrl+'/api/Student/pagination/'+pageNo+'/'+pageSize,{headers});
}
//---------------------export to excel--------------------------------------------
exportToExcel(data: any[], fileName: string, sheetName: string): void {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}
//----------------------------authentication-----------------------------------
private loggedIn = false;
  authenticate(username: string, password: string): boolean {
    if (username === 'deepu' && password === '12345678') {
      this.loggedIn = true;
      return true;
    }
    this.loggedIn = false;
    return false;
  }
  isLoggedIn(): boolean {
    return this.loggedIn;
  }
  logedname:string= '';
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password};
    var rsa = forge.pki.publicKeyFromPem(this.publicKey);
  var encrypted = window.btoa(rsa.encrypt(password));
  loginData.password=encrypted;
  console.log(encrypted);
    return this.http.post<any>(`${this.baseApiUrl}/api/Users/login`, loginData).pipe(
      map(response => {
        if (response && response.token) {
          this.logedname=response.userName;
          this.storeToken(response.token);
          return { success: true, token: response.token,data:response };
        } else {
          throw new Error('Invalid response from the server');
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return of({ success: false, message: 'Login failed. Please check your credentials.' });
      })
    );
  }
 
  storeToken(token: string): void {
    localStorage.setItem('token',token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  checkUserExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseApiUrl}/api/users/check-exists?email=${email}`);
  }
  getLoggedInUser() {
    return this.logedname;
  }
  LoginWithGoogle(credentials:string):Observable<any>{
    const header =new HttpHeaders().set('Content-type','application/json');
    return this.http.post(this.baseApiUrl+"/api/Users/LoginWithGoogle",JSON.stringify(credentials),{headers:header});
  }
  LoginWithMicrosoft(credentials:string):Observable<any>{
    const header =new HttpHeaders().set('Content-type','application/json');
    return this.http.post(this.baseApiUrl+"/api/Users/LoginWithMicrosoft",JSON.stringify(credentials),{headers:header});
  }
  public signOutExternal = () =>{
    localStorage.removeItem("token");
    console.log("token deleted");
  }
  openDialog(title: string, input1Placeholder: string, input2Placeholder: string): Promise<any> {
    const dialogRef = this.dialog.open(DialogcComponent, {
      width: '300px',
      data: { title, input1Placeholder, input2Placeholder, input1: '', input2: '' }
    });

    return dialogRef.afterClosed().toPromise();
  }
}
