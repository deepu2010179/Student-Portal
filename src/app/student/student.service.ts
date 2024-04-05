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
  private tokenKey = 'auth_token';
  constructor(private http: HttpClient) { }

  
 getAllRecords():Observable<student[]>{
  const headers = new HttpHeaders().set('Api_Key', this.apiKey);
  return this.http.get<student[]>(this.baseApiUrl+'/api/Student/query',{headers});
 }
 
 getAllUsers():Observable<user1[]>{
  const headers = this.getHeaders();
  return this.http.get<user1[]>(this.baseApiUrl+'/api/Users/users',{headers});
 }
 
 addStudent(addStudentrequest1:student1): Observable<student1>{
  const headers = new HttpHeaders().set('Api_Key', this.apiKey);
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
  const headers = new HttpHeaders().set('Api_Key', this.apiKey);
  var rsa = forge.pki.publicKeyFromPem(this.publicKey);
  var encrypted = window.btoa(rsa.encrypt(addUserrequest.hashed_password));
  console.log(encrypted);
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
    // }).catch((error) => {
    //   console.error('Error hashing password:', error);
    //   observer.error(error);
    });
  // });
}
getHeaders() {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }).set('Api_Key', this.apiKey);
  }
 getStudent(id:string):Observable<student1>{
  const headers = new HttpHeaders().set('Api_Key', this.apiKey);
  return this.http.get<student1>(this.baseApiUrl+'/api/Student/'+id,{headers});
 }
 updateStudent(id:number,updateStudentRequest:student1):Observable<student1>{
  const headers = new HttpHeaders().set('Api_Key', this.apiKey);
  const currentDateAndTime: Date = new Date();
  updateStudentRequest.modifiedOn = currentDateAndTime;
  return this.http.put<student1>(this.baseApiUrl+'/api/Student/'+id,updateStudentRequest,{headers});
}
deleteStudent(id:number):Observable<student1>{
  const headers = new HttpHeaders().set('Api_Key', this.apiKey);
  return this.http.delete<student1>(this.baseApiUrl+'/api/Student/'+id,{headers});
}
deleteUser(id:number):Observable<user1>{
  const headers = new HttpHeaders().set('Api_Key', this.apiKey);
  return this.http.delete<user1>(this.baseApiUrl+'/api/Users/'+id,{headers});
}
getStates(): Observable<state> {
  const headers = new HttpHeaders().set('Api_Key', this.apiKey);
  return this.http.get<state>(this.baseApiUrl+'/api/Student',{headers});
}
getCitiesByState(stateId: number): Observable<city> {
  const headers = new HttpHeaders().set('Api_Key', this.apiKey);
  return this.http.get<city>(this.baseApiUrl+'/api/Student/state/'+stateId,{headers});
}
checkemail(email:string):Observable<boolean>{
  const headers = new HttpHeaders().set('Api_Key', this.apiKey);
 return this.http.get<boolean>(this.baseApiUrl+'/api/Student/checke/'+email,{headers});
}
checkmobile(mobile:string):Observable<boolean>{
  const headers = new HttpHeaders().set('Api_Key', this.apiKey);
  return this.http.get<boolean>(this.baseApiUrl+'/api/Student/checkm/'+mobile,{headers});
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
}
