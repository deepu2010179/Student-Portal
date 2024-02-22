import { Injectable,ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { student } from '../models/student.model';
import { student1 } from '../models/student1.model';
import { state } from '../models/state.model';
import { city } from '../models/city.model';
import { environment } from '../../environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  @ViewChild('st') stu: ElementRef | undefined;

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
  return this.http.get<student[]>(this.baseApiUrl+'/api/Student/query');
 }
 
 addStudent(addStudentrequest1:student1): Observable<student1>{
  addStudentrequest1.id=0;
  const currentDateAndTime: Date = new Date();
  addStudentrequest1.code=this.generateId();
  addStudentrequest1.createdBy= 1;
  addStudentrequest1.createdOn = currentDateAndTime;
  addStudentrequest1.modifiedBy = 1;
  addStudentrequest1.modifiedOn = currentDateAndTime;
  return this.http.post<student1>(this.baseApiUrl+'/api/Student',addStudentrequest1);
 }
 getStudent(id:string):Observable<student1>{
  return this.http.get<student1>(this.baseApiUrl+'/api/Student/'+id);
 }
 updateStudent(id:number,updateStudentRequest:student1):Observable<student1>{
  const currentDateAndTime: Date = new Date();
  updateStudentRequest.modifiedOn = currentDateAndTime;
  return this.http.put<student1>(this.baseApiUrl+'/api/Student/'+id,updateStudentRequest);
}
deleteStudent(id:number):Observable<student1>{
  return this.http.delete<student1>(this.baseApiUrl+'/api/Student/'+id);
}
getStates(): Observable<state> {
  return this.http.get<state>(this.baseApiUrl+'/api/Student');
}
getCitiesByState(stateId: number): Observable<city> {
  return this.http.get<city>(this.baseApiUrl+'/api/Student/state/'+stateId);
}
checkemail(email:string):Observable<boolean>{
 return this.http.get<boolean>(this.baseApiUrl+'/api/Student/checke/'+email);
}
checkmobile(mobile:string):Observable<boolean>{
  return this.http.get<boolean>(this.baseApiUrl+'/api/Student/checkm/'+mobile);
 }
}