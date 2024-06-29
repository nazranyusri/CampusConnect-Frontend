import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePersakaComponent } from './update-persaka.component';

describe('UpdatePersakaComponent', () => {
  let component: UpdatePersakaComponent;
  let fixture: ComponentFixture<UpdatePersakaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePersakaComponent]
    });
    fixture = TestBed.createComponent(UpdatePersakaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
