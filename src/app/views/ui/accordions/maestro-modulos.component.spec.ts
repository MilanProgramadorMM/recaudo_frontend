import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroModulosComponent } from './maestro-modulos.component';

describe('AccordionsComponent', () => {
  let component: MaestroModulosComponent;
  let fixture: ComponentFixture<MaestroModulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaestroModulosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestroModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
