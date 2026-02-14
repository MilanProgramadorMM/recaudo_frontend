import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPaymentManagmentModalComponent } from './credit-payment-managment-modal.component';

describe('CreditPaymentManagmentModalComponent', () => {
  let component: CreditPaymentManagmentModalComponent;
  let fixture: ComponentFixture<CreditPaymentManagmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditPaymentManagmentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditPaymentManagmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
