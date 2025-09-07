import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLocationModalComponent } from './create-location-modal.component';

describe('CreateLocationModalComponent', () => {
  let component: CreateLocationModalComponent;
  let fixture: ComponentFixture<CreateLocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLocationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
