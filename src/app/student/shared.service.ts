import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private courseIdSubject = new BehaviorSubject<string | null>(null);
  courseId$ = this.courseIdSubject.asObservable();
  private teachIdSubject = new BehaviorSubject<string | null>(null);
  teachId$ = this.teachIdSubject.asObservable();
  private teacherIdSubject = new BehaviorSubject<number>(0);
  teacherId$ = this.teacherIdSubject.asObservable();
  private classIdSubject = new BehaviorSubject<string | null>(null);
  classId$ = this.classIdSubject.asObservable();
  private roleSubject = new BehaviorSubject<string[]>([]);
  role$ = this.roleSubject.asObservable();
  roles:string[]=[];
  setCourseId(id: string | null) {
    this.courseIdSubject.next(id);
  }
  setClassId(id: string | null) {
    this.classIdSubject.next(id);
  }
  setRoles(id:string[]) {
    this.roles=id;
  }
  setTeacherId(id:number){
    this.teacherIdSubject.next(id);
  }setTeachId(id: string | null) {
    this.teachIdSubject.next(id);
  }
}