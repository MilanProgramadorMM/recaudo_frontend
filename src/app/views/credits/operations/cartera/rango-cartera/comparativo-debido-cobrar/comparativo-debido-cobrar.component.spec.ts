import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativoDebidoCobrarComponent } from './comparativo-debido-cobrar.component';

describe('ComparativoDebidoCobrarComponent', () => {
  let component: ComparativoDebidoCobrarComponent;
  let fixture: ComponentFixture<ComparativoDebidoCobrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparativoDebidoCobrarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparativoDebidoCobrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
