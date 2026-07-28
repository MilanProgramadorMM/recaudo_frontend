import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraEstadoComponent } from './cartera-estado.component';

describe('CarteraEstadoComponent', () => {
  let component: CarteraEstadoComponent;
  let fixture: ComponentFixture<CarteraEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteraEstadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteraEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
