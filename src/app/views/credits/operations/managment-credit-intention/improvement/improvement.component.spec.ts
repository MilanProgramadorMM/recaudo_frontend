import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementComponent } from './improvement.component';

describe('ImprovementComponent', () => {
  let component: ImprovementComponent;
  let fixture: ComponentFixture<ImprovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImprovementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImprovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
