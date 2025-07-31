import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterChartComponent } from './water-chart.component';

describe('WaterChartComponent', () => {
  let component: WaterChartComponent;
  let fixture: ComponentFixture<WaterChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
