import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedSurveyComponent } from './detailed-survey.component';

describe('DetailedSurveyComponent', () => {
  let component: DetailedSurveyComponent;
  let fixture: ComponentFixture<DetailedSurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailedSurveyComponent]
    });
    fixture = TestBed.createComponent(DetailedSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
