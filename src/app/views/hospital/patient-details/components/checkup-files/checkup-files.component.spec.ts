import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckupFilesComponent } from './checkup-files.component';

describe('CheckupFilesComponent', () => {
  let component: CheckupFilesComponent;
  let fixture: ComponentFixture<CheckupFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckupFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckupFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
