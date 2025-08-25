import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmortizationsComponent } from './amortizations.component';

describe('AmortizationsComponent', () => {
  let component: AmortizationsComponent;
  let fixture: ComponentFixture<AmortizationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmortizationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmortizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
