import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationIntentionComponent } from './simulation-intention.component';

describe('SimulationIntentionComponent', () => {
  let component: SimulationIntentionComponent;
  let fixture: ComponentFixture<SimulationIntentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationIntentionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationIntentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
