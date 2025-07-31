import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalContactsComponent } from './hospital-contacts.component';

describe('HospitalContactsComponent', () => {
  let component: HospitalContactsComponent;
  let fixture: ComponentFixture<HospitalContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalContactsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
