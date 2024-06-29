import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramRegistrantComponent } from './program-registrant.component';

describe('ProgramRegistrantComponent', () => {
  let component: ProgramRegistrantComponent;
  let fixture: ComponentFixture<ProgramRegistrantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramRegistrantComponent]
    });
    fixture = TestBed.createComponent(ProgramRegistrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
