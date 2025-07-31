import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConfigPermisionsComponent } from './user-config-permisions.component';

describe('UserConfigPermisionsComponent', () => {
  let component: UserConfigPermisionsComponent;
  let fixture: ComponentFixture<UserConfigPermisionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserConfigPermisionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserConfigPermisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
