import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditApprovalComponent } from './credit-approval.component';

describe('CreditApprovalComponent', () => {
  let component: CreditApprovalComponent;
  let fixture: ComponentFixture<CreditApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
