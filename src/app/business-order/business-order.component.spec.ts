import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessOrderComponent } from './business-order.component';

describe('BusinessOrderComponent', () => {
  let component: BusinessOrderComponent;
  let fixture: ComponentFixture<BusinessOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessOrderComponent]
    });
    fixture = TestBed.createComponent(BusinessOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
