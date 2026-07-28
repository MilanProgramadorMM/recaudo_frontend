import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraEvolucionComponent } from './cartera-evolucion.component';

describe('CarteraEvolucionComponent', () => {
  let component: CarteraEvolucionComponent;
  let fixture: ComponentFixture<CarteraEvolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteraEvolucionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteraEvolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
