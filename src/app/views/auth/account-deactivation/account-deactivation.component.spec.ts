import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDeactivationComponent } from './account-deactivation.component';

describe('AccountDeactivationComponent', () => {
  let component: AccountDeactivationComponent;
  let fixture: ComponentFixture<AccountDeactivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDeactivationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDeactivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
