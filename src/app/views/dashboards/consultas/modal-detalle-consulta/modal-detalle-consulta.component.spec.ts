import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleConsultaComponent } from './modal-detalle-consulta.component';

describe('ModalDetalleConsultaComponent', () => {
  let component: ModalDetalleConsultaComponent;
  let fixture: ComponentFixture<ModalDetalleConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetalleConsultaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
