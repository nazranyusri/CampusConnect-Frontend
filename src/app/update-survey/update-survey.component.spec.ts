import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSurveyComponent } from './update-survey.component';

describe('UpdateSurveyComponent', () => {
  let component: UpdateSurveyComponent;
  let fixture: ComponentFixture<UpdateSurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSurveyComponent]
    });
    fixture = TestBed.createComponent(UpdateSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
