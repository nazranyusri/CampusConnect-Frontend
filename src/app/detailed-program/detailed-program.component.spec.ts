import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedProgramComponent } from './detailed-program.component';

describe('DetailedProgramComponent', () => {
  let component: DetailedProgramComponent;
  let fixture: ComponentFixture<DetailedProgramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailedProgramComponent]
    });
    fixture = TestBed.createComponent(DetailedProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
