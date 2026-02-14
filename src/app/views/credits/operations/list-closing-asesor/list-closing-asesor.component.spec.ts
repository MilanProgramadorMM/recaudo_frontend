import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClosingAsesorComponent } from './list-closing-asesor.component';

describe('ListClosingAsesorComponent', () => {
  let component: ListClosingAsesorComponent;
  let fixture: ComponentFixture<ListClosingAsesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListClosingAsesorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListClosingAsesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
