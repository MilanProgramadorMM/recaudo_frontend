import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeIntentionComponent } from './see-intention.component';

describe('SeeIntentionComponent', () => {
  let component: SeeIntentionComponent;
  let fixture: ComponentFixture<SeeIntentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeIntentionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeIntentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
