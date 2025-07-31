import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatedCardComponent } from './estimated-card.component';

describe('EstimatedCardComponent', () => {
  let component: EstimatedCardComponent;
  let fixture: ComponentFixture<EstimatedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimatedCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimatedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
