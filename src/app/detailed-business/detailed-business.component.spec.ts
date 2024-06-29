import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedBusinessComponent } from './detailed-business.component';

describe('DetailedBusinessComponent', () => {
  let component: DetailedBusinessComponent;
  let fixture: ComponentFixture<DetailedBusinessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailedBusinessComponent]
    });
    fixture = TestBed.createComponent(DetailedBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
