import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarIconsComponent } from './solar-icons.component';

describe('SolarIconsComponent', () => {
  let component: SolarIconsComponent;
  let fixture: ComponentFixture<SolarIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolarIconsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
