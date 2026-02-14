import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayPenaltyModalComponent } from './delay-penalty-modal.component';

describe('DelayPenaltyModalComponent', () => {
  let component: DelayPenaltyModalComponent;
  let fixture: ComponentFixture<DelayPenaltyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelayPenaltyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelayPenaltyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
