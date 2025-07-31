import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorTwo404Component } from './error-two-404.component';

describe('ErrorTwo404Component', () => {
  let component: ErrorTwo404Component;
  let fixture: ComponentFixture<ErrorTwo404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorTwo404Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorTwo404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
