import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAssignRolComponent } from './user-assign-rol.component';

describe('UserAssignRolComponent', () => {
  let component: UserAssignRolComponent;
  let fixture: ComponentFixture<UserAssignRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAssignRolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAssignRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
