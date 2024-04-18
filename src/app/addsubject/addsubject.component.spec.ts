import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsubjectComponent } from './addsubject.component';

describe('AddsubjectComponent', () => {
  let component: AddsubjectComponent;
  let fixture: ComponentFixture<AddsubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddsubjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddsubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
