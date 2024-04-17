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
  constructor(private http: HttpClient) { }

  
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
 getAllTeachers():Observable<teacher[]>{
  const headers = this.getHeaders();
  return this.http.get<teacher[]>(this.baseApiUrl+'/api/Teacher/teachers',{headers});
 }
 getAllClasses():Observable<Class[]>{
  const headers = this.getHeaders();
  return this.http.get<Class[]>(this.baseApiUrl+'/api/Class/classes',{headers});
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
 getTeacher(id:string):Observable<teacher>{
  const headers = this.getHeaders();
  return this.http.get<teacher>(this.baseApiUrl+'/api/Teacher/'+id,{headers});
 }
 getClass(id:string):Observable<Class>{
  const headers = this.getHeaders();
  return this.http.get<Class>(this.baseApiUrl+'/api/Class/'+id,{headers});
 }
 getClassByCourseId(id:string|null):Observable<Class[]>{
  const headers = this.getHeaders();
  return this.http.get<Class[]>(this.baseApiUrl+'/api/Class/courseid/'+id,{headers});
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
updateTeacher(id:number,updateTeacherRequest:course):Observable<teacher>{
  const headers = this.getHeaders();
  const currentDateAndTime: Date = new Date();
  updateTeacherRequest.modifiedOn = currentDateAndTime;
  return this.http.put<teacher>(this.baseApiUrl+'/api/Teacher/'+id,updateTeacherRequest,{headers});
}
updateClass(id:number,updateClassRequest:course):Observable<Class>{
  const headers = this.getHeaders();
  const currentDateAndTime: Date = new Date();
  updateClassRequest.modifiedOn = currentDateAndTime;
  return this.http.put<Class>(this.baseApiUrl+'/api/Class/'+id,updateClassRequest,{headers});
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
deleteTeacher(id:number):Observable<teacher>{
  const headers = this.getHeaders();
  return this.http.delete<teacher>(this.baseApiUrl+'/api/Teacher/'+id,{headers});
}
deleteClass(id:number):Observable<Class>{
  const headers = this.getHeaders();
  return this.http.delete<Class>(this.baseApiUrl+'/api/Class/'+id,{headers});
}
getStates(): Observable<state> {
  const headers = this.getHeaders();
  return this.http.get<state>(this.baseApiUrl+'/api/Student',{headers});
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
}
