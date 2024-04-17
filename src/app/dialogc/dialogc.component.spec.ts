import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogcComponent } from './dialogc.component';

describe('DialogcComponent', () => {
  let component: DialogcComponent;
  let fixture: ComponentFixture<DialogcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogcComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
