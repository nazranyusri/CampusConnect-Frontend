import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProgramComponent } from './update-program.component';

describe('UpdateProgramComponent', () => {
  let component: UpdateProgramComponent;
  let fixture: ComponentFixture<UpdateProgramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateProgramComponent]
    });
    fixture = TestBed.createComponent(UpdateProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
