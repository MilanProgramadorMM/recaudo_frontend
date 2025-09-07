import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDiscountsComponent } from './other-discounts.component';

describe('OtherDiscountsComponent', () => {
  let component: OtherDiscountsComponent;
  let fixture: ComponentFixture<OtherDiscountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherDiscountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
