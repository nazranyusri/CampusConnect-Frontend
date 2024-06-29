import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersakaComponent } from './persaka.component';

describe('PersakaComponent', () => {
  let component: PersakaComponent;
  let fixture: ComponentFixture<PersakaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersakaComponent]
    });
    fixture = TestBed.createComponent(PersakaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
