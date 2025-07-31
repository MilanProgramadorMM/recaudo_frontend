import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillChartComponent } from './skill-chart.component';

describe('SkillChartComponent', () => {
  let component: SkillChartComponent;
  let fixture: ComponentFixture<SkillChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
