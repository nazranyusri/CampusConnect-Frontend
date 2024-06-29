import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessComponent } from './add-business.component';

describe('AddBusinessComponent', () => {
  let component: AddBusinessComponent;
  let fixture: ComponentFixture<AddBusinessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBusinessComponent]
    });
    fixture = TestBed.createComponent(AddBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
