import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagmentCreditIntentionComponent } from './managment-credit-intention.component';

describe('ManagmentCreditIntentionComponent', () => {
  let component: ManagmentCreditIntentionComponent;
  let fixture: ComponentFixture<ManagmentCreditIntentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagmentCreditIntentionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagmentCreditIntentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
