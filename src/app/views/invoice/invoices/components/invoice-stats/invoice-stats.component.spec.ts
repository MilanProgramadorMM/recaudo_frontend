import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceStatsComponent } from './invoice-stats.component';

describe('InvoiceStatsComponent', () => {
  let component: InvoiceStatsComponent;
  let fixture: ComponentFixture<InvoiceStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
