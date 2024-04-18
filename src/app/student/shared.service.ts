import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private courseIdSubject = new BehaviorSubject<string | null>(null);
  courseId$ = this.courseIdSubject.asObservable();
  private classIdSubject = new BehaviorSubject<string | null>(null);
  classId$ = this.classIdSubject.asObservable();

  setCourseId(id: string | null) {
    this.courseIdSubject.next(id);
  }
  setClassId(id: string | null) {
    this.classIdSubject.next(id);
  }
}