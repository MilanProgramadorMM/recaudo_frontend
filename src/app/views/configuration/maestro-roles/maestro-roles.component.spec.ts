import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroRolesComponent } from './maestro-roles.component';

describe('MaestroRolesComponent', () => {
  let component: MaestroRolesComponent;
  let fixture: ComponentFixture<MaestroRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaestroRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestroRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
