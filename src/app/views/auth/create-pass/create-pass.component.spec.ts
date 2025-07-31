import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePassComponent } from './create-pass.component';

describe('CreatePassComponent', () => {
  let component: CreatePassComponent;
  let fixture: ComponentFixture<CreatePassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
