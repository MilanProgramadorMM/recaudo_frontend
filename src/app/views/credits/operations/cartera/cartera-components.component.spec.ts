import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraComponentsComponent } from './cartera-components.component';

describe('CarteraComponentsComponent', () => {
  let component: CarteraComponentsComponent;
  let fixture: ComponentFixture<CarteraComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteraComponentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteraComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
