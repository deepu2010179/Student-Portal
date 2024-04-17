import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private courseIdSubject = new BehaviorSubject<string | null>(null);
  courseId$ = this.courseIdSubject.asObservable();

  setCourseId(id: string | null) {
    this.courseIdSubject.next(id);
  }
}