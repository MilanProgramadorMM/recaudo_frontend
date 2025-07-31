import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWithPinComponent } from './login-with-pin.component';

describe('LoginWithPinComponent', () => {
  let component: LoginWithPinComponent;
  let fixture: ComponentFixture<LoginWithPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginWithPinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginWithPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
