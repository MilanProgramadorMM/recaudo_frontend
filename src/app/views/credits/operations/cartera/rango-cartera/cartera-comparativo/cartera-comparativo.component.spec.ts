import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraComparativoComponent } from './cartera-comparativo.component';

describe('CarteraComparativoComponent', () => {
  let component: CarteraComparativoComponent;
  let fixture: ComponentFixture<CarteraComparativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteraComparativoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteraComparativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
