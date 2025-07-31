import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentStatCardComponent } from './appointment-stat-card.component';

describe('AppointmentStatCardComponent', () => {
  let component: AppointmentStatCardComponent;
  let fixture: ComponentFixture<AppointmentStatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentStatCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentStatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
