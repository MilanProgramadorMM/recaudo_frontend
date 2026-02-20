import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReversePaymentModalComponent } from './reverse-payment-modal.component';

describe('ReversePaymentModalComponent', () => {
  let component: ReversePaymentModalComponent;
  let fixture: ComponentFixture<ReversePaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReversePaymentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReversePaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
